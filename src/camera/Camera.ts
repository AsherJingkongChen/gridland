import { Attachable } from '../design/Attachable';
import {
  windowPreventDefault,
  KeyModifierOption
} from '../input';
import {
  Container,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Point,
} from 'pixi.js';

windowPreventDefault('wheel');

/**
 * Simple auto camera, moves via x and y, scales via zoom
 */
export class Camera extends Container
implements Attachable {

  public static ZoomKMO =
    new KeyModifierOption({ ctrlKey: true });

  private _canvas: Container;
  private _last: Point;
  private _moving: boolean;
  private _viewport: Container;
  private _z: number;

  public readonly attach: () => void;
  public readonly detach: () => void;

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
   * @param canvas The Container under camera
   * @param maxZoom Maximum of scale, default is 100 (10000%)
   */
  constructor(canvas?: Container, maxZoom?: number) {
    super();
    
    this._canvas = canvas || new Container();
    this._last = new Point();
    this._moving = false;
    this._viewport = new Container();
    this._z = maxZoom || 100;
    
    this.attach = () => {
      this.detach();

      this.interactive = true;
      this.visible = true;

      this.on('pointerdown', this._pointerdown);
      this.on('pointermove', this._pointermove);
      this.on('pointerup', this._pointerup);
      this.on('pointerupoutside', this._pointerupoutside);
      this.on('wheel', this._wheel);
    };

    this.detach = () => {
      this.interactive = false;
      this.visible = false;

      this.off('pointerdown', this._pointerdown);
      this.off('pointermove', this._pointermove);
      this.off('pointerup', this._pointerup);
      this.off('pointerupoutside', this._pointerupoutside);
      this.off('wheel', this._wheel);
    };

    this
      .addChild(this._viewport)
      .addChild(this._canvas);

    this.on('added', this.attach);
    this.on('removed', this.detach);
  }

  private _pointerdown(e: FederatedPointerEvent) {
    if (e.button == 0) {
      this._leftpointerdown(e);
    }
  }

  private _leftpointerdown(e: FederatedPointerEvent) {
    this._moveclientAtGlobal(e.client);
    this._last.copyFrom(e.client);
    this._moving = true;
  }

  private _pointermove(e: FederatedPointerEvent) {
    if (this._moving) {
      this._moveAtGlobal(e);
    }
  }

  private _pointerup(e: FederatedPointerEvent) {
    if (this._moving) {
      this._moveAtGlobal(e);
      this._moving = false;
    }
  }

  private _pointerupoutside(e: FederatedPointerEvent) {
    if (this._moving) {
      this._moveAtGlobal(e);
      this._moving = false;
    }
  }

  private _wheel(e: FederatedWheelEvent) {
    if (Camera.ZoomKMO.equal(e)) {
      this._zoomAtGlobal(e);
    }
  }

  private _moveclientAtGlobal(client: Point) {
    const { x: pivotX, y: pivotY } = this._viewport.toLocal(client);
    this._viewport.pivot.x = pivotX;
    this._viewport.pivot.y = pivotY;

    const { x: positionX, y: positionY } = this.toLocal(client);
    this._viewport.position.x = positionX;
    this._viewport.position.y = positionY;
  }

  private _moveAtGlobal(e: FederatedPointerEvent) {
    const { x: newX, y: newY } = this.toLocal(e.client);
    const { x: oldX, y: oldY } = this.toLocal(this._last);
    this._last.copyFrom(e.client);

    this._viewport.position.x += newX - oldX;
    this._viewport.position.y += newY - oldY;
  }

  private _zoomAtGlobal(e: FederatedWheelEvent) {
    this._moveclientAtGlobal(e.client);

    const z = Math.max(1, this._z + e.deltaY);
    this._viewport.scale.x *= this._z / z;
    this._viewport.scale.y *= this._z / z;
    this._z = z;
  }
};
