import { Attachable } from '../design/Attachable';
import { invSqrt } from 'fast-inv-sqrt';
import {
  windowPreventDefault,
  KeyboardInputOption
} from '../input';
import {
  Container,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Point,
} from 'pixi.js';

windowPreventDefault('wheel');
windowPreventDefault('keydown');

/**
 * Simple auto camera, moves via x and y, scales via zoom
 */
export class Camera extends Container
implements Attachable {

  public static ZoomWheelKIO = 
    new KeyboardInputOption({ ctrlKey: true });

  public static ZoominKIO =
    new KeyboardInputOption({ ctrlKey: true, code: 'Equal' });

  public static ZoomoutKIO =
    new KeyboardInputOption({ ctrlKey: true, code: 'Minus' });

  private _canvas: Container;
  private _cursor: Point;
  private _moving: boolean;
  private _viewport: Container;
  private _z: number;
  private readonly _zoominout: (e: KeyboardEvent) => void;

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
   * Alias to scale
   */
  public get zoom(): number {
    return this._viewport.scale.x
  }

  /**
   * Alias to scale
   */
  public set zoom(zoom: number) {
    this._viewport.scale.x = zoom;
    this._viewport.scale.y = zoom;
  }

  /**
   * @param canvas
   * The Container inside Camera
   * 
   * @param maxZoom
   * Maximum of zoom, default is 32 (3200%);
   * Minimum of zoom is always 0.01 (1%)
   */
  constructor(canvas?: Container, maxZoom?: number) {
    super();
    const _maxZoom = maxZoom || 64;

    this._canvas = canvas || new Container();
    this._cursor = new Point();
    this._moving = false;
    this._viewport = new Container();
    this._z = _maxZoom;

    this._zoominout = (e) => {
      if (Camera.ZoominKIO.equal(e)) {
        this._movecursorOnWindow(this._cursor);
        this._zoomOnWindow(-_maxZoom / 6);

      } else if (Camera.ZoomoutKIO.equal(e)) {
        if (this.zoom <= 0.01) { return; }

        this._movecursorOnWindow(this._cursor);
        this._zoomOnWindow(+_maxZoom / 6);
      }
    };

    this
      .addChild(this._viewport)
      .addChild(this._canvas);

    this.on('added', this.attach);
    this.on('removed', this.detach);
  }

  public attach() {
    this.detach();

    this.interactive = true;
    this.visible = true;

    this.on('pointerdown', this._pointerdown);
    this.on('pointermove', this._pointermove);
    this.on('pointerup', this._pointerup);
    this.on('pointerupoutside', this._pointerupoutside);
    this.on('wheel', this._wheel);
    window.addEventListener('keydown', this._zoominout);
  }

  public detach() {
    this.interactive = false;
    this.visible = false;

    this.off('pointerdown', this._pointerdown);
    this.off('pointermove', this._pointermove);
    this.off('pointerup', this._pointerup);
    this.off('pointerupoutside', this._pointerupoutside);
    this.off('wheel', this._wheel);
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
      this._cursor.copyFrom(e.client);
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
    if (Camera.ZoomWheelKIO.equal(e)) {
      if (e.deltaY > 0 && this.zoom <= 0.01) {
        return;
      }
  
      this._movecursorOnWindow(e.client);
      this._zoomOnWindow(e.deltaY);
    }
  }

  private _movecursorOnWindow(cursor: Point) {
    this._viewport.toLocal(cursor, undefined, this._viewport.pivot);
    this.toLocal(cursor, undefined, this._viewport.position);

    this._cursor.copyFrom(cursor);
  }

  private _moveOnWindow(cursor: Point) {
    const { x: newX, y: newY } = this.toLocal(cursor);
    const { x: oldX, y: oldY } = this.toLocal(this._cursor);
    this._viewport.position.x += newX - oldX;
    this._viewport.position.y += newY - oldY;

    this._cursor.copyFrom(cursor);
  }

  /**
   * z-axis projected zooming (fixed with inverse sqrt of zoom)
   */
  private _zoomOnWindow(dz: number) {
    const z = Math.max(1, this._z + dz * invSqrt(this.zoom));
    this._viewport.scale.x *= this._z / z;
    this._viewport.scale.y *= this._z / z;
    this._z = z;
  }
};
