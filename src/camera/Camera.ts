import {
  Container,
  BitmapText,
  BitmapFont,
  FederatedPointerEvent,
  Ticker,
  FederatedWheelEvent,
  Point,
} from 'pixi.js';

window.addEventListener(
  'wheel',
  (e) => { e.preventDefault(); },
  { passive: false }
);

window.addEventListener(
  'keydown',
  (e) => { e.preventDefault(); },
  { passive: false }
);

window.addEventListener(
  'keydown',
  (e) => { console.log(e); }
);

BitmapFont.from('Stats', {
  fontFamily: 'Arial',
  fontSize: 12,
  fill: '#ffffff',
  fontWeight: 'normal'
},
{
  chars: BitmapFont.ASCII, 
});

export const statsPanel =
  new BitmapText(
    '',
    {
      fontName: 'Stats',
      align: 'left'
    }
  );

/**
 * Simple auto camera, moves via x and y, zooms via zoom
 */
export class Camera extends Container {
  private _viewport: Container;
  private _moving: boolean;
  private _last: Point;
  private _z: number;

  public canvas: Container;

  /**
   * local x
   */
  override get x(): number {
    return this._viewport.pivot.x;
  }

  /**
   * local x
   */
  override set x(x: number) {
    this._viewport.pivot.x = x;
  }

  /**
   * local y
   */
  override get y(): number {
    return this._viewport.pivot.y;
  }

  /**
   * local y
   */
  override set y(y: number) {
    this._viewport.pivot.y = y;
  }

  /**
   * Alias to scale
   */
  get zoom(): number {
    return this._viewport.scale.x
  }

  /**
   * Alias to scale
   */
  set zoom(zoom: number) {
    this._viewport.scale.x = zoom;
    this._viewport.scale.y = zoom;
  }

  /**
   * @param canvas The Container under camera
   * @param maxZoom Maximum of scale, default is 100 (10000%)
   */
  constructor(canvas?: Container, maxZoom?: number) {
    super();
    this.interactive = true;
    
    // this.canvas.getBounds(); // [TODO]
    this.canvas = canvas || new Container();
    this._viewport = new Container();
    this._moving = false;
    this._last = new Point();
    this._z = maxZoom || 100;

    (this)
      .addChild(this._viewport)
      .addChild(this.canvas);

    this.on('added', this._attach);
    this.on('removed', this._detach);

    // [TODO]
    Ticker.shared.add(() => {
      statsPanel.text = JSON.stringify({ camera: this.stats }, null, 2);
    });
  }

  private _attach() {
    this.on('pointerdown', this._pointerdown);
    this.on('pointermove', this._pointermove);
    this.on('pointerup', this._pointerup);
    this.on('pointerupoutside', this._pointerupoutside);
    this.on('wheel', this._wheel);
  }

  private _detach() {
    this.off('pointerdown', this._pointerdown);
    this.off('pointermove', this._pointermove);
    this.off('pointerup', this._pointerup);
    this.off('pointerupoutside', this._pointerupoutside);
    this.off('wheel', this._wheel);
  }

  private _pointerdown(e: FederatedPointerEvent) {
    if (e.button == 0) {
      this._leftpointerdown(e);
    }
  }

  private _leftpointerdown(e: FederatedPointerEvent) {
    this._last.copyFrom(e.client);
    this._moving = true;
  }

  private _pointermove(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._moveAtGlobal(e);
  }

  private _pointerup(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._moveAtGlobal(e);
    this._moving = false;
  }

  private _pointerupoutside(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._moveAtGlobal(e);
    this._moving = false;
  }

  private _wheel(e: FederatedWheelEvent) {
    if (!e.metaKey && !e.ctrlKey) { return; }

    this._zoomAtGlobal(e);
  }

  private _moveAtGlobal(e: FederatedPointerEvent) {
    const { x: newX, y: newY } = this.toLocal(e.client);
    const { x: oldX, y: oldY } = this.toLocal(this._last);
    this._last.copyFrom(e.client);

    this._viewport.position.x += newX - oldX;
    this._viewport.position.y += newY - oldY;
  }

  private _zoomAtGlobal(e: FederatedWheelEvent) {
    const { x: pivotX, y: pivotY } = this._viewport.toLocal(e.client);
    this._viewport.pivot.x = pivotX;
    this._viewport.pivot.y = pivotY;

    const { x: positionX, y: positionY } = this.toLocal(e.client);
    this._viewport.position.x = positionX;
    this._viewport.position.y = positionY;

    const z = Math.max(1, this._z + e.deltaY);
    this._viewport.scale.x *= this._z / z;
    this._viewport.scale.y *= this._z / z;
    this._z = z;
  }

  get stats() {
    return {
      zoom: this.zoom.toFixed(2),
      position: {
        x: this._viewport.position.x.toFixed(2),
        y: this._viewport.position.y.toFixed(2)
      },
      pivot: {
        x: this._viewport.pivot.x.toFixed(2),
        y: this._viewport.pivot.y.toFixed(2)
      },
      canvas: {
        w: this.canvas.width.toFixed(2),
        h: this.canvas.height.toFixed(2)
      },
      border: undefined
    };
  }

  // checkBounds() {
  //   if (this.needBounds) {
  //     this.getBounds();
  //     this.needBounds = false;
  //   }

  //   if (this.viewX < this._bounds.minX) {
  //     this.viewX = this._bounds.minX;
  //   }

  //   if (this.viewX > this._bounds.maxX - this.viewWidth) {
  //     this.viewX = this._bounds.maxX - this.viewWidth;
  //   }

  //   if (this.viewY < this._bounds.minY) {
  //     this.viewY = this._bounds.minY;
  //   }

  //   if (this.viewY > this._bounds.maxY - this.viewHeight) {
  //     this.viewY = this._bounds.maxY - this.viewHeight;
  //   }
  // }
};
