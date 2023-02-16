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

  private _canvas: Container;
  private _client: Point;
  private _dragging: boolean;
  private _viewport: Container;
  private readonly _zoominout: (e: KeyboardEvent) => void;

  public event: utils.EventEmitter<CameraEvents>;
  public maxzoom: number;
  public minzoom: number;
  public zoominKIO: KeyboardInputOption;
  public zoomoutKIO: KeyboardInputOption;
  public zoomwheelKIO: KeyboardInputOption;

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
   * Maximum of zoom, by default it's 10.0 (1000%)
   * 
   * @param options.minzoom
   * Minimum of zoom, by default it's 0.1 (10%)
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
        canvas?: Container,
        maxzoom?: number,
        minzoom?: number,
        zoominKIO?: KeyboardInputOption,
        zoomoutKIO?: KeyboardInputOption,
        zoomwheelKIO?: KeyboardInputOption
      }
    ) {

    super();

    this._canvas = options?.canvas || new Container();
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

    this.event = new utils.EventEmitter();
    this.maxzoom = options?.maxzoom || 10;
    this.minzoom = options?.minzoom || .1;

    this.zoominKIO =
      options?.zoominKIO ||
      new KeyboardInputOption({ ctrlKey: true, code: 'Equal' });

    this.zoomoutKIO =
      options?.zoomoutKIO ||
      new KeyboardInputOption({ ctrlKey: true, code: 'Minus' });

    this.zoomwheelKIO =
      options?.zoomwheelKIO ||
      new KeyboardInputOption({ ctrlKey: true });

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
      .on('pointerdown', this._onpointerdown)
      .on('pointermove', this._onpointermove)
      .on('pointerup', this._onpointerup)
      .on('pointerupoutside', this._onpointerupoutside)
      .on('wheel', this._onwheel);

    window.addEventListener('keydown', this._zoominout);
  }

  public detach() {
    this.interactive = false;
    this.visible = false;

    this
      .off('pointerdown', this._onpointerdown)
      .off('pointermove', this._onpointermove)
      .off('pointerup', this._onpointerup)
      .off('pointerupoutside', this._onpointerupoutside)
      .off('wheel', this._onwheel);

    window.removeEventListener('keydown', this._zoominout);
  }

  private _onpointerdown(e: FederatedPointerEvent) {
    if (e.button == 0) {
      this._leftpointerdown();
    }
  }

  private _leftpointerdown() {
    this._dragging = true;
  }

  private _onpointermove(e: FederatedPointerEvent) {
    if (this._dragging) {
      this._dragOnWindow(e.client);
    } else {
      this._moveOnWindow(e.client);
    }
  }

  private _onpointerup() {
    if (this._dragging) {
      this._dragging = false;
    }
  }

  private _onpointerupoutside(e: FederatedPointerEvent) {
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
