import { Container, Graphics } from 'pixi.js';

export class MonoScene extends Container {
  private background: Graphics;

  constructor(
      x: number, 
      y: number, 
      width: number, 
      height: number, 
      color: number) {

    super();
    
    this.x = x;
    this.y = y;

    this.background =
      new Graphics()
      .beginFill(color)
      .drawRect(0, 0, width, height)
      .endFill();

    this.addChild(this.background);
  }

  resize(width: number, height: number) {
    this.background.width = width;
    this.background.height = height;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
};
