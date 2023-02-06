import { Container } from 'pixi.js';
import { MonoScene } from './MonoScene';

export class TileScene extends Container {
  private scenes: MonoScene[][];

  constructor(
      x: number, 
      y: number, 
      width: number,
      height: number,
      colorMap: number[][]) {

    super();

    this.x = x;
    this.y = y;

    this.scenes = [];
    const widthDivided = width / colorMap[0].length;
    const heightDivided = height / colorMap.length;

    colorMap.forEach((row, r) => {
      this.scenes.push([]);

      row.forEach((col, c) => {
        const scene = new MonoScene(
          widthDivided * c,
          heightDivided * r,
          widthDivided,
          heightDivided,
          col
        );

        this.addChild(scene);
        this.scenes[r].push(scene);
      });
    });
  }

  resize(width: number, height: number) {
    const widthDivided = width / this.scenes[0].length;
    const heightDivided = height / this.scenes.length;

    this.scenes.forEach((row, r) => {
      row.forEach((col, c) => {
        col.resize(widthDivided, heightDivided);
        col.moveTo(widthDivided * c, heightDivided * r);
      });
    });
  }

  forEach(callbackfn: (scene: MonoScene) => void) {
    this.scenes.forEach((row) => {
      row.forEach(callbackfn);
    });
  }
};
