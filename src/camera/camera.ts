import {
  Container,
  BitmapText,
  BitmapFont,
  FederatedPointerEvent,
  Ticker,
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
  private movement: Movement;
  private _z: number = 512;

  locked: boolean = false;
  canvas: Container;

  override get x(): number {
    return this.pivot.x;
  }
  
  override set x(x: number) {
    this.pivot.x = x;
  }

  override get y(): number {
    return this.pivot.y;
  }

  override set y(y: number) {
    this.pivot.y = y;
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

  get windowX(): number {
    return this.x * this.scale.x;
  }

  set windowX(windowX: number) {
    this.x = windowX / this.scale.x;
  }

  get windowY(): number {
    return this.y * this.scale.y;
  }

  set windowY(windowY: number) {
    this.y = windowY / this.scale.y;
  }

  constructor(canvas: Container) {
    super();

    this.canvas = canvas;
    this.addChild(this.canvas);
    // this.canvas.getBounds(); // [TODO]

    const centerPosition = () => {
      this.position.set(
        window.innerWidth / 2, 
        window.innerHeight / 2
      );
    };

    centerPosition();
    window.addEventListener('resize', centerPosition);

    this.windowX = window.innerWidth / 2;
    this.windowY = window.innerHeight / 2;

    this.interactive = true;
    this.movement = new Movement();

    Ticker.shared.add(() => {
      statsPanel.text = JSON.stringify(this.stats, null, 2); // [TODO]
    });

    this.on('pointerdown', (e) => {
      if (this.locked) { return; }

      this.movement.moving = true;
      this.movement.origin.x = e.clientX;
      this.movement.origin.y = e.clientY;
    });

    this.on('pointermove', (e) => {
      if (this.locked) { return; }
      if (! this.movement.moving) { return; }

      moveEvent(e);
      this.movement.origin.x = e.clientX;
      this.movement.origin.y = e.clientY;
    });

    this.on('pointerup', (e) => {
      if (this.locked) { return; }

      moveEvent(e);
      this.movement.moving = false;
    });

    this.on('pointerupoutside', (e) => {
      if (this.locked) { return; }

      moveEvent(e);
      this.movement.moving = false;
    });

    this.on('wheel', (e) => {
      if (this.locked) { return; }
      if (!e.metaKey && !e.ctrlKey) { return; }

      this.z += e.deltaY;
    });

    const moveEvent = (e: FederatedPointerEvent) => {
      this.windowX += -(e.x - this.movement.origin.x);
      this.windowY += -(e.y - this.movement.origin.y);
    };
  }

  get stats() {
    return {
      camera: {
        pivot: { x: this.x, y: this.y, z: this.z },
        scale: `${Math.round(this.scale.x * 100)}%`
      },
      canvas: {
        size: { w: this.canvas.width, h: this.canvas.height }
      }
    }
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

// helper class for moving object
//
interface Movement {
  moving: boolean;
  origin: {
    x: number;
    y: number;
  }
};

class Movement implements Movement {
  moving = false;
  origin = {
    x: 0,
    y: 0
  }
};
