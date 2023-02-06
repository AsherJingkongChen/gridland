import {
  Container,
  BitmapText,
  BitmapFont,
  FederatedPointerEvent,
  Ticker,
  FederatedWheelEvent,
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
 * Camera is controlled with x, y and z
 */
export class Camera extends Container {
  public canvas: Container;
  private _moving: boolean;
  private _z: number;

  get localX(): number {
    return this.pivot.x;
  }
  
  set localX(localX: number) {
    this.pivot.x = localX;
  }

  get localY(): number {
    return this.pivot.y;
  }
  
  set localY(localY: number) {
    this.pivot.y = localY;
  }

  get globalX(): number {
    return this.localX * this.worldTransform.a;
  }

  set globalX(globalX: number) {
    this.localX = globalX / this.worldTransform.a;
  }

  get globalY(): number {
    return this.localY * this.worldTransform.d;
  }

  set globalY(globalY: number) {
    this.localY = globalY / this.worldTransform.d;
  }

  override get x(): number {
    return this.localX;
  }

  override set x(x: number) {
    this.localX = x;
  }

  override get y(): number {
    return this.localY;
  }

  override set y(y: number) {
    this.localY = y;
  }

  get z(): number {
    return this._z;
  }

  set z(z: number) {
    z = Math.max(z, 1);
    const r = z / this.z;
    this.scale.x /= r;
    this.scale.y /= r;
    this._z = z;
  }

  constructor(canvas: Container) {
    super();
    this.interactive = true;
    this.addChild(canvas);
    
    // this.canvas.getBounds(); // [TODO]
    this.canvas = canvas;
    this._moving = false;
    this._z = 0;

    this.on('added', this._attach);
    this.on('removed', this._detach);

    // [TODO]
    Ticker.shared.add(() => {
      statsPanel.text = JSON.stringify({ camera: this.stats }, null, 2);
    });
  }

  private _attach() {
    this._recursivePostUpdateTransform();
    this._z = window.innerWidth / 2;

    this._centerPosition();
    window.addEventListener(
      'resize',
      this._centerPosition.bind(this)
    );

    this.on('pointerdown', this._pointerdown);
    this.on('pointermove', this._pointermove);
    this.on('pointerup', this._pointerup);
    this.on('pointerupoutside', this._pointerupoutside);
    this.on('wheel', this._wheel);
  }

  private _detach() {
    window.removeEventListener(
      'resize', 
      this._centerPosition.bind(this)
    );

    this.off('pointerdown', this._pointerdown);
    this.off('pointermove', this._pointermove);
    this.off('pointerup', this._pointerup);
    this.off('pointerupoutside', this._pointerupoutside);
    this.off('wheel', this._wheel);
  }

  private _pointerdown(e: FederatedPointerEvent) {
    if (e.button == 0) {
      this._leftpointerdown();
    }
  }

  private _leftpointerdown() {
    this._moving = true;
  }

  private _pointermove(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._pointermoveHelper(e);
  }

  private _pointerup(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._pointermoveHelper(e);
    this._moving = false;
  }

  private _pointerupoutside(e: FederatedPointerEvent) {
    if (! this._moving) { return; }

    this._pointermoveHelper(e);
    this._moving = false;
  }

  private _wheel(e: FederatedWheelEvent) {
    if (!e.metaKey && !e.ctrlKey) { return; }

    this.z += 2 * e.deltaY;
  }

  private _pointermoveHelper(e: FederatedPointerEvent) {
    this.globalX += -e.movementX;
    this.globalY += -e.movementY;
  }

  private _centerPosition() {
    this.position.set(
      window.innerWidth / 2 / this.parent.worldTransform.a,
      window.innerHeight / 2 / this.parent.worldTransform.d
    );
  }

  get stats() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      scale: `${Math.round(this.scale.x * 100)}%`,
      canvas: {
        w: this.canvas.width,
        h: this.canvas.height
      }
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
