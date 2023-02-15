import {
  windowPreventDefault,
  KeyboardInputOption,
} from '../input';
import {
  BitmapText,
  BitmapFont,
  IBitmapTextStyle,
  Graphics,
  Ticker,
  ISize,
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

  public static TickInterval: number = 12;
  public static ToggleKIO = new KeyboardInputOption({ code: 'F12' });
  public static Alpha = 0.4;

  private _lastTick: number;
  public readonly _onresize: () => void;
  private _size: ISize;
  private _statsSet: Set<Stats>;
  private readonly _ticker: () => void;
  public readonly _toggle: (e: KeyboardEvent) => void;

  public resizeTo: HTMLElement | Window;

  /**
   * Come with resizeTo's width
   */
   public override get width() : number {
    return this._size.width;
  }

  /**
   * Come with resizeTo's height
   */
  public override get height(): number {
    return this._size.height;
  }

  constructor(resizeTo?: HTMLElement | Window) {
    super();

    this._lastTick = StatsPanel.TickInterval;

    // [TODO] fix for HTMLCanvasElement
    this._onresize = () => {
      if (this.resizeTo instanceof Window) {
        const { innerWidth, innerHeight } = this.resizeTo;
        this.resize(innerWidth, innerHeight);
      } else {
        const { clientWidth, clientHeight } = this.resizeTo;
        this.resize(clientWidth, clientHeight);
      }
    };

    this._size = { width: 0, height: 0 };
    this._statsSet = new Set();

    this._ticker = () => {
      if (this._lastTick >= StatsPanel.TickInterval) {
        this.notify();
        this._lastTick = 0;
      }
      this._lastTick += 1;
    };

    this._toggle = (e) => {
      if (StatsPanel.ToggleKIO.equal(e)) {
        if (this.visible) {
          this.detach();
        } else {
          this.attach();
        }
      }
    };

    this.resizeTo = resizeTo || window;

    this.on('added', this.attach);
    this.once('added', this.detach);
    this.on('removed', this.detach);
    window.addEventListener('keydown', this._toggle);
  }

  public attach() {
    this.detach();

    this.visible = true;
    this._onresize();

    this.resizeTo.addEventListener('resize', this._onresize);
    Ticker.shared.add(this._ticker);
  }

  public detach() {
    this.visible = false;

    this.resizeTo.removeEventListener('resize', this._onresize);
    Ticker.shared.remove(this._ticker);
  }

  public resize(width: number, height: number) {
    this.clear();
    this.beginFill(0x000000, StatsPanel.Alpha);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this._size.width = width;
    this._size.height = height;
    this.notify();
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
  public update: (stats: Stats, panel: StatsPanel) => string;

  /**
   * @param update
   * Its result will be assigned to BitmapText.text
   */
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
