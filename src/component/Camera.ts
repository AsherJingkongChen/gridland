import {
  Attachable,
  Eventable,
  EventEmitter
} from '../design';
import { KeyInput } from '../entity';
import {
  Container,
  DisplayObject,
  FederatedMouseEvent,
  FederatedWheelEvent,
  Point
} from 'pixi.js';
import { windowPreventDefault } from '../tool';

windowPreventDefault('keydown');
windowPreventDefault('wheel');

/**
 * Simple auto camera, moves via x and y, zooms via zoom
 */
export class Camera
  extends Container
  implements Attachable, Eventable<CameraEvents>
{
  public event: EventEmitter<CameraEvents>;
  public maxzoom: number;
  public minzoom: number;
  public zoominKI: KeyInput;
  public zoomoutKI: KeyInput;
  public zoomwheelKI: KeyInput;

  private _client: Point;
  private _dragging: boolean;
  private _viewport: Container;
  private readonly _zoominout: (e: KeyboardEvent) => void;

  /**
   * Camera's target
   */
  public get stage(): DisplayObject | undefined {
    return this._viewport.children[0] as DisplayObject;
  }

  /**
   * Camera's target
   */
  public set stage(stage: DisplayObject | undefined) {
    if (this._viewport.children.length === 1) {
      this._viewport.removeChildAt(0);
    }
    if (stage !== undefined) {
      this._viewport.addChildAt(stage, 0);
    }
  }

  /**
   * x of the local position
   */
  public override get x(): number {
    return this._viewport.pivot.x;
  }

  /**
   * x of the local position
   */
  public override set x(x: number) {
    this._viewport.pivot.x = x;
  }

  /**
   * y of the local position
   */
  public override get y(): number {
    return this._viewport.pivot.y;
  }

  /**
   * y of the local position
   */
  public override set y(y: number) {
    this._viewport.pivot.y = y;
  }

  /**
   * Scale
   */
  public get zoom(): number {
    return this._viewport.scale.x;
  }

  /**
   * Scale
   */
  public set zoom(zoom: number) {
    this._viewport.scale.x = zoom;
    this._viewport.scale.y = zoom;
  }

  /**
   * @param option.maxzoom
   * Maximum of zoom, by default it's 10.0 (1000%)
   *
   * @param option.minzoom
   * Minimum of zoom, by default it's 0.1 (10%)
   *
   * @param option.stage
   * The Container inside Camera
   *
   * @param option.zoominKI
   * KI to zoom in, by default it's { ctrlKey, Equal }
   *
   * @param option.zoomoutKI
   * KI to zoom out, by default it's { ctrlKey, Minus }
   *
   * @param option.zoomwheelKI
   * KI to zoom with wheel, by default it's { ctrlKey }
   */
  constructor(option?: {
    maxzoom?: number;
    minzoom?: number;
    stage?: DisplayObject;
    zoominKI?: KeyInput;
    zoomoutKI?: KeyInput;
    zoomwheelKI?: KeyInput;
  }) {
    super();

    this._client = new Point();
    this._dragging = false;
    this._viewport = new Container();

    this._zoominout = (e) => {
      if (this.zoominKI.equal(e)) {
        this._zoomOnWindow(+10);
      } else if (this.zoomoutKI.equal(e)) {
        this._zoomOnWindow(-10);
      }
    };

    this.event = new EventEmitter();
    this.maxzoom = option?.maxzoom || 10;
    this.minzoom = option?.minzoom || 0.1;
    this.stage = option?.stage;

    this.zoominKI =
      option?.zoominKI ||
      new KeyInput({
        ctrlKey: true,
        code: 'Equal'
      });

    this.zoomoutKI =
      option?.zoomoutKI ||
      new KeyInput({
        ctrlKey: true,
        code: 'Minus'
      });

    this.zoomwheelKI =
      option?.zoomwheelKI ||
      new KeyInput({ ctrlKey: true });

    this.addChild(this._viewport);

    this.on('added', this.attach).on(
      'removed',
      this.detach
    );
  }

  public override destroy() {
    super.destroy();
    this.detach();

    (this._client as unknown) = undefined;
    this._dragging = false;

    this._viewport.destroy();
    (this._viewport as unknown) = undefined;

    (this._zoominout as unknown) = undefined;

    this.event.removeAllListeners();
    (this.event as unknown) = undefined;

    this.maxzoom = Infinity;
    this.minzoom = 0;
    (this.zoominKI as unknown) = undefined;
    (this.zoomoutKI as unknown) = undefined;
    (this.zoomwheelKI as unknown) = undefined;
  }

  public attach() {
    this.detach();

    this.interactive = true;
    this.visible = true;

    this.on('mousedown', this._onmousedown)
      .on('mousemove', this._onmousemove)
      .on('mouseup', this._onmouseup)
      .on('mouseupoutside', this._onmouseupoutside)
      .on('wheel', this._onwheel);

    window.addEventListener('keydown', this._zoominout);
  }

  public detach() {
    this.interactive = false;
    this.visible = false;

    this.off('mousedown', this._onmousedown)
      .off('mousemove', this._onmousemove)
      .off('mouseup', this._onmouseup)
      .off('mouseupoutside', this._onmouseupoutside)
      .off('wheel', this._onwheel);

    window.removeEventListener('keydown', this._zoominout);
  }

  private _onmousedown(e: FederatedMouseEvent) {
    if (e.button == 0) {
      this._dragging = true;
    }
  }

  private _onmousemove(e: FederatedMouseEvent) {
    if (this._dragging) {
      this._dragOnWindow(e.client);
    } else {
      this._moveOnWindow(e.client);
    }
  }

  private _onmouseup() {
    if (this._dragging) {
      this._dragging = false;
    }
  }

  private _onmouseupoutside(e: FederatedMouseEvent) {
    if (this._dragging) {
      this._dragOnWindow(e.client);
      this._dragging = false;
    }
  }

  private _onwheel(e: FederatedWheelEvent) {
    if (this.zoomwheelKI.equal(e)) {
      this._zoomOnWindow(-e.deltaY);
    }
  }

  private _dragOnWindow(client: Point) {
    const { x: newX, y: newY } = this.toLocal(client);
    const { x: oldX, y: oldY } = this.toLocal(this._client);
    this._viewport.position.x += newX - oldX;
    this._viewport.position.y += newY - oldY;
    this._client.copyFrom(client);
    this.event.emit('drag', this);
  }

  private _moveOnWindow(client: Point) {
    this._viewport.toLocal(
      client,
      undefined,
      this._viewport.pivot
    );
    this.toLocal(
      client,
      undefined,
      this._viewport.position
    );
    this._client.copyFrom(client);
    this.event.emit('move', this);
  }

  /**
   * zoom by approximation
   */
  private _zoomOnWindow(delta: number) {
    if (delta >= 0) {
      this.zoom = Math.min(
        this.maxzoom,
        this.zoom * (1 + delta / 50)
      );
    } else {
      this.zoom = Math.max(
        this.minzoom,
        this.zoom / (1 + -delta / 50)
      );
    }
    this.event.emit('zoom', this);
  }
}

export interface CameraEvents {
  drag: [camera: Camera];
  move: [camera: Camera];
  zoom: [camera: Camera];
}
