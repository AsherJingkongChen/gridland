import { Container, Point } from "pixi.js";

/**
 * View for statistics
 */
export class StatsPanel extends Container {
  public resizeTo: HTMLElement | Window;
  public size: Point;
  private _resize: () => void;

  constructor(resizeTo?: HTMLElement | Window) {
    super();

    this.resizeTo = resizeTo || window;
    this.size = new Point();

    this.on('added', this.attach);
    this.on('removed', this.detach);

    this._resize = () => {
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
    };
  }

  public attach() {
    this._resize();
    globalThis.addEventListener('resize', this._resize);
  }

  public detach() {
    globalThis.removeEventListener('resize', this._resize);
  }
};

  // interface IObserver {
  //   update(): void;
  // };
  
  // interface IObservable {
  //   add(observer: IObserver): void;
  //   remove(observer: IObserver): void;
  //   notifyAll(): void;
  // };
  
  // class Button implements IObservable {
  //   bulbs: Bulb[] = [];
  
  //   toggle() {
  //       this.notifyAll();
  //   }
  
  //   add(bulb: Bulb) {
  //       this.bulbs.push(bulb);
  //   }
  
  //   remove(bulb: Bulb) {
  //       this.bulbs.splice(this.bulbs.indexOf(bulb), 1);
  //   }
  
  //   notifyAll() {
  //       this.bulbs.forEach((b) => {
  //           b.switch();
  //       });
  //   }
  // };
  
  // class Bulb implements IObserver {
  //   on = false;
  
  //   switch(): void {
  //       this.on = !this.on;
  //   }
  
  //   update() {
  //       this.switch();
  //   }
  // };
