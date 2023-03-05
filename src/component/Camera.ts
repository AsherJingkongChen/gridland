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
  IPointData,
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
  public swipeKI: KeyInput;
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
    if (stage) {
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
   * Maximum of zoom, by default it's 15.0 (1500%)
   *
   * @param option.minzoom
   * Minimum of zoom, by default it's 0.25 (25%)
   *
   * @param option.stage
   * The Container inside Camera
   *
   * @param option.swipeKI
   * KI to swipe, by default it's {}
   *
   * @param option.zoominKI
   * KI to zoom in, by default it's { Equal }
   *
   * @param option.zoomoutKI
   * KI to zoom out, by default it's { Minus }
   *
   * @param option.zoomwheelKI
   * KI to zoom with wheel, by default it's { ctrlKey }
   */
  constructor(option?: {
    maxzoom?: number;
    minzoom?: number;
    stage?: DisplayObject;
    swipeKI?: KeyInput;
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
        this._zoomOnWindow(+16);
      } else if (this.zoomoutKI.equal(e)) {
        this._zoomOnWindow(-16);
      }
    };

    this.event = new EventEmitter();
    this.maxzoom = option?.maxzoom ?? 15.0;
    this.minzoom = option?.minzoom ?? 0.25;
    this.stage = option?.stage;

    this.swipeKI = option?.swipeKI ?? new KeyInput();

    this.zoominKI =
      option?.zoominKI ??
      new KeyInput({
        code: 'Equal'
      });

    this.zoomoutKI =
      option?.zoomoutKI ??
      new KeyInput({
        code: 'Minus'
      });

    this.zoomwheelKI =
      option?.zoomwheelKI ??
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

    this.on('mousedown', this._onMousedown)
      .on('mousemove', this._onMousemove)
      .on('mouseup', this._onMouseup)
      .on('mouseupoutside', this._onMouseupoutside)
      .on('wheel', this._onWheel);

    window.addEventListener('keydown', this._zoominout);
  }

  public detach() {
    this.interactive = false;
    this.visible = false;

    this.off('mousedown', this._onMousedown)
      .off('mousemove', this._onMousemove)
      .off('mouseup', this._onMouseup)
      .off('mouseupoutside', this._onMouseupoutside)
      .off('wheel', this._onWheel);

    window.removeEventListener('keydown', this._zoominout);
  }

  private _onMousedown(e: FederatedMouseEvent) {
    if (e.button == 0) {
      this._dragging = true;
    }
  }

  private _onMousemove(e: FederatedMouseEvent) {
    if (this._dragging) {
      this._dragOnWindow(e.client);
    } else {
      this._moveOnWindow(e.client);
    }
  }

  private _onMouseup() {
    if (this._dragging) {
      this._dragging = false;
    }
  }

  private _onMouseupoutside(e: FederatedMouseEvent) {
    if (this._dragging) {
      this._dragOnWindow(e.client);
      this._dragging = false;
    }
  }

  private _onWheel(e: FederatedWheelEvent) {
    if (this.zoomwheelKI.equal(e)) {
      this._zoomOnWindow(-e.deltaY);
    } else if (this.swipeKI.equal(e)) {
      const { x, y } = this._client;
      this._dragOnWindow({
        x: x - e.deltaX,
        y: y - e.deltaY
      });
      this._moveOnWindow({ x, y });
    }
  }

  private _dragOnWindow(client: IPointData) {
    const { x: newX, y: newY } = this.toLocal(client);
    const { x: oldX, y: oldY } = this.toLocal(this._client);
    this._viewport.position.x += newX - oldX;
    this._viewport.position.y += newY - oldY;
    this._client.copyFrom(client);
    this.event.emit('drag', this);
  }

  private _moveOnWindow(client: IPointData) {
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
