import { Container, Point } from "pixi.js";

/**
 * View for statistics
 */
export class StatsPanel extends Container {
  public resizeTo: HTMLElement | Window;
  public size: Point;

  constructor(resizeTo?: HTMLElement | Window) {
    super();

    this.resizeTo = resizeTo || window;
    this.size = new Point();

    this.on('added', this.attach);
    this.on('removed', this.detach);
  }

  public attach() {
    this._resize();
    globalThis.addEventListener('resize', this._resize);
  }

  public detach() {
    globalThis.removeEventListener('resize', this._resize);
  }

  private _resize = () => {
    if (this.resizeTo === window) {
      const { innerWidth, innerHeight } = this.resizeTo as Window;
      this.size.x = innerWidth;
      this.size.y = innerHeight;
    } else {
      const { clientWidth, clientHeight } = this.resizeTo as HTMLElement;
      this.size.x = clientWidth;
      this.size.y = clientHeight;
    }
    console.log(this.size.x, this.size.y); // [LOG]
  }
};
