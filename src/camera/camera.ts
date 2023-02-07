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
 * Simple auto camera
 */
export class Camera extends Container {
  public canvas: Container;
  private _viewport: Container;
  private _moving: boolean;
  private _last: Point;
  private _z: number;

  get localX(): number {
    return this._viewport.pivot.x;
  }
  
  set localX(localX: number) {
    this._viewport.pivot.x = localX;
  }

  get localY(): number {
    return this._viewport.pivot.y;
  }
  
  set localY(localY: number) {
    this._viewport.pivot.y = localY;
  }

  get z(): number {
    return this._z;
  }

  set z(z: number) {
    z = Math.max(z, 1);
    this._viewport.scale.x *= this.z / z;
    this._viewport.scale.y *= this.z / z;
    this._z = z;
  }

  constructor(canvas: Container, maxScale: number = 100) {
    super();
    this.interactive = true;
    
    // this.canvas.getBounds(); // [TODO]
    this.canvas = canvas;
    this._viewport = new Container();
    this._moving = false;
    this._last = new Point();
    this._z = maxScale;

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

    this._moveFromWindow(e);
  }

  private _pointerup(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._moveFromWindow(e);
    this._moving = false;
  }

  private _pointerupoutside(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._moveFromWindow(e);
    this._moving = false;
  }

  private _wheel(e: FederatedWheelEvent) {
    if (!e.metaKey && !e.ctrlKey) { return; }

    this._zoomFromWindow(e);
  }

  private _moveFromWindow(e: FederatedPointerEvent) {
    const { x: oldX, y: oldY } = this.toLocal(this._last);
    const { x: newX, y: newY } = this.toLocal(e.client);
    this._last.copyFrom(e.client);

    this._viewport.position.x += newX - oldX;
    this._viewport.position.y += newY - oldY;
  }

  private _zoomFromWindow(e: FederatedWheelEvent) {
    const { x: pivotX, y: pivotY } = this._viewport.toLocal(e.client);
    this._viewport.pivot.x = pivotX;
    this._viewport.pivot.y = pivotY;

    const { x: positionX, y: positionY } = this.toLocal(e.client);
    this._viewport.position.x = positionX;
    this._viewport.position.y = positionY;

    this.z += e.deltaY;
  }

  get stats() {
    return {
      z: this.z.toFixed(2),
      scale: this._viewport.scale.x.toFixed(2),
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
