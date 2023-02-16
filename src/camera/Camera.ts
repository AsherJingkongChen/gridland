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
  FederatedPointerEvent,
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

  public static ZoominKIO =
    new KeyboardInputOption({ ctrlKey: true, code: 'Equal' });
  
  public static ZoomoutKIO =
    new KeyboardInputOption({ ctrlKey: true, code: 'Minus' });

  public static ZoomwheelKIO = 
    new KeyboardInputOption({ ctrlKey: true });

  private _canvas: Container;
  private _cursor: Point;
  private _moving: boolean;
  private _viewport: Container;
  private readonly _zoominout: (e: KeyboardEvent) => void;

  public readonly event: utils.EventEmitter<CameraEvents>;
  public maxzoom: number;
  public minzoom: number;

  /**
   * View
   */
  get canvas(): Container {
    return this._canvas;
  }

  /**
   * View
   */
  set canvas(canvas: Container) {
    this._viewport.removeChild(this._canvas);
    this._canvas = canvas;
    this._viewport.addChild(this._canvas);
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
   * @param options.canvas
   * The Container inside Camera
   * 
   * @param options.maxzoom
   * Maximum of zoom, default is 10.0 (1000%)
   * 
   * @param options.minzoom
   * Minimum of zoom, default is 0.1 (10%)
   */
  constructor(
      options?: {
        canvas?: Container,
        maxzoom?: number,
        minzoom?: number
      }
    ) {

    super();

    this._canvas = options?.canvas || new Container();
    this._cursor = new Point();
    this._moving = false;
    this._viewport = new Container();

    this._zoominout = (e) => {
      if (Camera.ZoominKIO.equal(e)) {
        this._zoomOnWindow(+10);

      } else if (Camera.ZoomoutKIO.equal(e)) {
        this._zoomOnWindow(-10);
      }
    };

    this.event = new utils.EventEmitter();
    this.maxzoom = options?.maxzoom || 10;
    this.minzoom = options?.minzoom || .1;

    this
      .addChild(this._viewport)
      .addChild(this._canvas);

    this
      .on('added', this.attach)
      .on('removed', this.detach);
  }

  public attach() {
    this.detach();

    this.interactive = true;
    this.visible = true;

    this
      .on('pointerdown', this._pointerdown)
      .on('pointermove', this._pointermove)
      .on('pointerup', this._pointerup)
      .on('pointerupoutside', this._pointerupoutside)
      .on('wheel', this._wheel);

    window.addEventListener('keydown', this._zoominout);
  }

  public detach() {
    this.interactive = false;
    this.visible = false;

    this
      .off('pointerdown', this._pointerdown)
      .off('pointermove', this._pointermove)
      .off('pointerup', this._pointerup)
      .off('pointerupoutside', this._pointerupoutside)
      .off('wheel', this._wheel);

    window.removeEventListener('keydown', this._zoominout);
  }

  private _pointerdown(e: FederatedPointerEvent) {
    if (e.button == 0) {
      this._leftpointerdown(e);
    }
  }

  private _leftpointerdown(e: FederatedPointerEvent) {
    this._movecursorOnWindow(e.client);
    this._moving = true;
  }

  private _pointermove(e: FederatedPointerEvent) {
    if (this._moving) {
      this._moveOnWindow(e.client);
    } else {
      this._movecursorOnWindow(e.client);
    }
  }

  private _pointerup(e: FederatedPointerEvent) {
    if (this._moving) {
      this._moveOnWindow(e.client);
      this._moving = false;
    }
  }

  private _pointerupoutside(e: FederatedPointerEvent) {
    if (this._moving) {
      this._moveOnWindow(e.client);
      this._moving = false;
    }
  }

  private _wheel(e: FederatedWheelEvent) {
    if (Camera.ZoomwheelKIO.equal(e)) {
      this._movecursorOnWindow(e.client);
      this._zoomOnWindow(-e.deltaY);
    }
  }

  private _movecursorOnWindow(cursor: Point) {
    this._viewport.toLocal(cursor, undefined, this._viewport.pivot);
    this.toLocal(cursor, undefined, this._viewport.position);
    this._cursor.copyFrom(cursor);

    this.event.emit('move', this);
    this.event.emit('update', this);
  }

  private _moveOnWindow(cursor: Point) {
    const { x: newX, y: newY } = this.toLocal(cursor);
    const { x: oldX, y: oldY } = this.toLocal(this._cursor);
    this._viewport.position.x += newX - oldX;
    this._viewport.position.y += newY - oldY;
    this._cursor.copyFrom(cursor);

    this.event.emit('move', this);
    this.event.emit('update', this);
  }

  /**
   * zoom by approximation
   */
  private _zoomOnWindow(delta: number) {
    /* Linear Symmetric Function: mul = 1 + |x|/50 */

    if (delta >= 0) {
      if (this.zoom < this.maxzoom) {
        this.zoom *= 1 + delta / 50;
        this.event.emit('zoom', this);
        this.event.emit('update', this);
      }
    } else if (this.zoom > this.minzoom) {
      this.zoom /= 1 + -delta / 50;
      this.event.emit('zoom', this);
      this.event.emit('update', this);
    }
  }
};

export interface CameraEvents {
  move: [camera: Camera];
  zoom: [camera: Camera];
  update: [camera: Camera];
}
