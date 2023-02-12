import {
  windowPreventDefault,
  KeyModifierOption
} from '../input';
import {
  BitmapText,
  BitmapFont,
  IBitmapTextStyle,
  Graphics,
  Point,
  Ticker
} from "pixi.js";
import {
  Attachable,
  IObserver,
  ISubject,
  Resizable
} from '../design';

windowPreventDefault('keydown');

/**
 * View for statistics
 */
export class StatsPanel extends Graphics
implements ISubject, Attachable, Resizable {

  public static TickInterval: number = 9;
  public static ToggleKMO = new KeyModifierOption({ key: 'F12' });
  public static Alpha = 0.3;

  private _lastTick: number;
  public readonly _onresize: () => void;
  private _size: Point;
  private _statsSet: Set<Stats>;
  private readonly _ticker: () => void;
  
  public readonly attach: () => void;
  public readonly detach: () => void;

  public readonly resize:
    (width: number, height: number) => void;

  public resizeTo: HTMLElement | Window;
  public readonly toggle: (e: KeyboardEvent) => void;

  /**
   * Come with resizeTo's height
   */
  public override get height(): number {
    return this._size.y;
  }

  /**
   * Come with resizeTo's width
   */
  public override get width() : number {
    return this._size.x;
  }

  constructor(resizeTo?: HTMLElement | Window) {
    super();

    this._lastTick = StatsPanel.TickInterval;

    this._onresize = () => {
      if (this.resizeTo === window) {
        const { innerWidth, innerHeight } = this.resizeTo;
        this.resize(innerWidth, innerHeight);
      } else {
        const { clientWidth, clientHeight } = this.resizeTo as HTMLElement;
        this.resize(clientWidth, clientHeight);
      }
    };

    this._size = new Point();
    this._statsSet = new Set();

    this._ticker = () => {
      if (this._lastTick >= StatsPanel.TickInterval) {
        this.notify();
        this._lastTick = 0;
      }
      this._lastTick += 1;
    };

    this.attach = () => {
      this.detach();

      this.visible = true;
      this._onresize();

      window.addEventListener('resize', this._onresize);
      Ticker.shared.add(this._ticker);
    };

    this.detach = () => {
      this.visible = false;

      window.removeEventListener('resize', this._onresize);
      Ticker.shared.remove(this._ticker);
    };

    this.resize = (width: number, height: number) => {
      this.clear();
      this.beginFill(0x000000, StatsPanel.Alpha);
      this.drawRect(0, 0, width, height);
      this.endFill();
      this._size.x = width;
      this._size.y = height;
      this.notify();
    };

    this.resizeTo = resizeTo || window;

    this.toggle = (e) => {
      if (StatsPanel.ToggleKMO.equal(e)) {
        if (this.visible) {
          this.detach();
        } else {
          this.attach();
        }
      }
    };

    this.on('added', this.attach);
    this.on('removed', this.detach);
    window.addEventListener('keydown', this.toggle);
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
    for (const stats of this._statsSet) {
      stats.text = stats.update(stats, this);
    }
  }
};

/**
 * Controller for statistics
 */
export class Stats extends BitmapText
implements IObserver {

  public static readonly DefaultFontName = 'Stats_Light_12';

  /**
   * The result will be assigned to BitmapText.text
   */
  public update: (stats: Stats, panel: StatsPanel) => string;

  constructor(
      update?: (stats: Stats, panel: StatsPanel) => string,
      style?: Partial<IBitmapTextStyle> | undefined) {

    if (style === undefined) {
      style = { fontName: Stats.DefaultFontName };

    } else if (style.fontName === undefined) {
      style.fontName = Stats.DefaultFontName;
    }

    super('', style);
    this.update = update || (() => '');
  }
};

BitmapFont.from(
  Stats.DefaultFontName,
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
