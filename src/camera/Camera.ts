import {
  Attachable,
  Eventable
} from '../design';
import {
  windowPreventDefault,
  KeyboardInputOption
} from '../input';
import {
  Container,
  DisplayObject,
  FederatedMouseEvent,
  FederatedWheelEvent,
  Point,
  utils,
} from 'pixi.js';

windowPreventDefault('wheel');
windowPreventDefault('keydown');

/**
 * Simple auto camera, moves via x and y, zooms via zoom
 */
export class Camera
extends Container
implements
    Attachable,
    Eventable<CameraEvents> {

  public event: utils.EventEmitter<CameraEvents>;
  public maxzoom: number;
  public minzoom: number;
  public zoominKIO: KeyboardInputOption;
  public zoomoutKIO: KeyboardInputOption;
  public zoomwheelKIO: KeyboardInputOption;

  private _client: Point;
  private _dragging: boolean;
  private _viewport: Container;
  private readonly _zoominout: (e: KeyboardEvent) => void;

  /**
   * Camera's target
   */
  get scene(): DisplayObject | undefined {
    return this._viewport.children[0];
  }

  /**
   * Camera's target
   */
  set scene(scene: DisplayObject | undefined) {
    if (this._viewport.children.length === 1) {
      this._viewport.removeChildAt(0);
    }
    if (scene !== undefined) {
      this._viewport.addChildAt(scene, 0);
    }
  }

  /**
   * Local x
   */
  public override get x(): number {
    return this._viewport.pivot.x;
  }

  /**
   * Local x
   */
  public override set x(x: number) {
    this._viewport.pivot.x = x;
  }

  /**
   * Local y
   */
  public override get y(): number {
    return this._viewport.pivot.y;
  }

  /**
   * Local y
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
   * @param options.maxzoom
   * Maximum of zoom, by default it's 10.0 (1000%)
   * 
   * @param options.minzoom
   * Minimum of zoom, by default it's 0.1 (10%)
   * 
   * @param options.scene
   * The Container inside Camera
   * 
   * @param options.zoominKIO
   * KIO to zoom in, by default it's { ctrlKey, Equal }
   * 
   * @param options.zoomoutKIO
   * KIO to zoom out, by default it's { ctrlKey, Minus }
   * 
   * @param options.zoomwheelKIO
   * KIO to zoom with wheel, by default it's { ctrlKey }
   */
  constructor(
      options?: {
        maxzoom?: number,
        minzoom?: number,
        scene?: Container,
        zoominKIO?: KeyboardInputOption,
        zoomoutKIO?: KeyboardInputOption,
        zoomwheelKIO?: KeyboardInputOption
      }
    ) {

    super();

    this.event = new utils.EventEmitter();
    this.maxzoom = options?.maxzoom || 10;
    this.minzoom = options?.minzoom || .1;
    this.scene = options?.scene;

    this.zoominKIO =
      options?.zoominKIO ||
      new KeyboardInputOption({ ctrlKey: true, code: 'Equal' });

    this.zoomoutKIO =
      options?.zoomoutKIO ||
      new KeyboardInputOption({ ctrlKey: true, code: 'Minus' });

    this.zoomwheelKIO =
      options?.zoomwheelKIO ||
      new KeyboardInputOption({ ctrlKey: true });

    this._client = new Point();
    this._dragging = false;
    this._viewport = new Container();

    this._zoominout = (e) => {
      if (this.zoominKIO.equal(e)) {
        this._zoomOnWindow(+10);

      } else if (this.zoomoutKIO.equal(e)) {
        this._zoomOnWindow(-10);
      }
    };

    this.addChild(this._viewport);

    this
      .on('added', this.attach)
      .on('removed', this.detach);
  }

  public override destroy() {
    super.destroy();
    this.detach();

    (this._client as any) = undefined;
    this._dragging = false;
    this._viewport.destroy();
    (this._viewport as any) = undefined;
    (this._zoominout as any) = undefined;

    this.event.removeAllListeners();
    (this.event as any) = undefined;
    this.maxzoom = Infinity;
    this.minzoom = 0;
    (this.zoominKIO as any) = undefined;
    (this.zoomoutKIO as any) = undefined;
    (this.zoomwheelKIO as any) = undefined;
  }

  public attach() {
    this.detach();

    this.interactive = true;
    this.visible = true;

    this
      .on('mousedown', this._onmousedown)
      .on('mousemove', this._onmousemove)
      .on('mouseup', this._onmouseup)
      .on('mouseupoutside', this._onmouseupoutside)
      .on('wheel', this._onwheel);

    window.addEventListener('keydown', this._zoominout);
  }

  public detach() {
    this.interactive = false;
    this.visible = false;

    this
      .off('mousedown', this._onmousedown)
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
    if (this.zoomwheelKIO.equal(e)) {
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
    this._viewport.toLocal(client, undefined, this._viewport.pivot);
    this.toLocal(client, undefined, this._viewport.position);
    this._client.copyFrom(client);

    this.event.emit('move', this);
  }

  /**
   * zoom by approximation
   */
  private _zoomOnWindow(delta: number) {
    if (delta >= 0) {
      this.zoom =
        Math.min(this.maxzoom, this.zoom * (1 + delta / 50));
    } else {
      this.zoom =
        Math.max(this.minzoom, this.zoom / (1 + -delta / 50));
    }
    this.event.emit('zoom', this);
  }
};

export interface CameraEvents {
  drag: [camera: Camera];
  move: [camera: Camera];
  zoom: [camera: Camera];
}
