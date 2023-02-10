import {
  BitmapText,
  Container,
  IBitmapTextStyle,
  Point,
  BitmapFont,
  Ticker,
  TickerCallback
} from "pixi.js";
import {
  IObserver,
  ISubject,
} from '../pattern/Observer';

/**
 * View for statistics
 */
export class StatsPanel extends Container
implements ISubject {

  public observers: Set<Stats>;
  
  public resizeTo: HTMLElement | Window;
  public size: Point;
  private _resize: () => void;

  public static readonly activeTick: number = 6;
  private _lastTick: number;
  private _ticker: TickerCallback<any>;

  constructor(resizeTo?: HTMLElement | Window) {
    super();

    this.resizeTo = resizeTo || window;
    this.size = new Point();
    this.observers = new Set();
    this._lastTick = StatsPanel.activeTick;

    this._resize = () => {
      if (this.resizeTo === window) {
        const { innerWidth, innerHeight } = this.resizeTo;
        this.size.x = innerWidth;
        this.size.y = innerHeight;

      } else if (this.resizeTo instanceof HTMLElement) {
        const { clientWidth, clientHeight } = this.resizeTo;
        this.size.x = clientWidth;
        this.size.y = clientHeight;
      }
      this.notifyAll();
    };

    this._ticker = () => {
      if (this._lastTick == StatsPanel.activeTick) {
        this.notifyAll();
        this._lastTick = 0;
      }
      this._lastTick += 1;
    };

    this.on('added', this.attach);
    this.on('removed', this.detach);
  }

  public attach() {
    this._resize();
    globalThis.addEventListener('resize', this._resize);
    Ticker.shared.add(this._ticker);
  }

  public detach() {
    globalThis.removeEventListener('resize', this._resize);
    Ticker.shared.remove(this._ticker);
  }

  public addOne(stats: Stats): Stats {
    this.observers.add(stats);
    this.addChild(stats);
    return stats;
  }

  public removeOne(stats: Stats): Stats | undefined {
    if (this.observers.delete(stats)) {
      this.removeChild(stats);
      return stats;
    }
    return undefined;
  }

  public notifyAll(): void {
    this.observers.forEach((stats) => {
      stats.text = stats.content();
      stats.update(stats, this);
    });
  }
};

export class Stats extends BitmapText
implements IObserver {

  public content: () => string;
  public update: (stats: Stats, panel: StatsPanel) => void;

  public static readonly defaultFontName = 'Stats_Light_12';

  constructor(
      content?: () => string,
      update?: (stats: Stats, panel: StatsPanel) => void,
      style?: Partial<IBitmapTextStyle> | undefined) {

    if (style === undefined) {
      style = { fontName: Stats.defaultFontName };

    } else if (style.fontName === undefined) {
      style.fontName = Stats.defaultFontName;
    }

    super('', style);

    this.content = content || (() => '');
    this.update = update || (() => {});
  }
};

BitmapFont.from(
  Stats.defaultFontName,
  {
    fontFamily: 'Menlo',
    fontSize: 12,
    fontWeight: 'normal',
    fill: 0xffffff
  },
  {
    chars: BitmapFont.ASCII
  }
);
  