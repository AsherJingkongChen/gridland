import { Attachable } from '../design/Attachable';
import { windowPreventDefault } from '../input/WindowPreventDefault';
import { Resizable } from '../design/Resizable';
import { keyMatch } from '../input/KeyMatch';
import {
  BitmapText,
  Container,
  IBitmapTextStyle,
  Point,
  BitmapFont,
  Ticker,
} from "pixi.js";
import {
  IObserver,
  ISubject,
} from '../design/Observer';

/**
 * View for statistics
 */
export class StatsPanel extends Container
implements ISubject, Attachable, Resizable {

  public static readonly activeTick: number = 9;

  private _lastTick: number;
  private _size: Point;
  private _statsSet: Set<Stats>;
  private _ticker: () => void;

  public readonly attach: () => void;
  public readonly detach: () => void;
  public readonly resize: () => void;
  public resizeTo: HTMLElement | Window;

  override get width(): number {
    return this._size.x;
  }

  override get height(): number {
    return this._size.y;
  }

  constructor(resizeTo?: HTMLElement | Window) {
    super();

    this.resizeTo = resizeTo || window;
    this._size = new Point();
    this._statsSet = new Set();
    this._lastTick = StatsPanel.activeTick;

    this.resize = () => {
      if (this.resizeTo === window) {
        const { innerWidth, innerHeight } = this.resizeTo;
        this._size.x = innerWidth;
        this._size.y = innerHeight;

      } else if (this.resizeTo instanceof HTMLElement) {
        const { clientWidth, clientHeight } = this.resizeTo;
        this._size.x = clientWidth;
        this._size.y = clientHeight;
      }
      this.notify();
    };

    this._ticker = () => {
      if (this._lastTick == StatsPanel.activeTick) {
        this.notify();
        this._lastTick = 0;
      }
      this._lastTick += 1;
    };

    this.attach = () => {
      this.resize();
      window.addEventListener('resize', this.resize);
      window.addEventListener('keydown', (e) => {
        if (keyMatch(e, { key: 'F12' })) {
          this.visible = ! this.visible;
        }
      });
      Ticker.shared.add(this._ticker);
      console.log('att'); // [LOG]
    };

    this.detach = () => {
      window.removeEventListener('resize', this.resize);
      // window.removeEventListener('keydown', kf);
      Ticker.shared.remove(this._ticker);
      console.log('det'); // [LOG]
    };

    this.on('added', this.attach);
    this.on('removed', this.detach);
  }

  public observe(stats: Stats): StatsPanel {
    this._statsSet.add(stats);
    this.addChild(stats);
    return this;
  }

  public unobserve(stats: Stats): Stats | undefined {
    if (this._statsSet.delete(stats)) {
      this.removeChild(stats);
      return stats;
    }
    return undefined;
  }

  public notify(): void {
    this._statsSet.forEach((stats) => {
      stats.text = stats.content();
      stats.update(stats, this);
    });
  }
};

/**
 * Controller for statistics
 */
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

windowPreventDefault('keydown');
  