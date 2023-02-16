import {
  windowPreventDefault,
  KeyboardInputOption,
} from '../input';
import {
  BitmapFont,
  Graphics,
  ISize,
  utils
} from "pixi.js";
import {
  Attachable,
  Resizable
} from '../design';

windowPreventDefault('keydown');

/**
 * View for statistics
 */
export class StatsPanel extends Graphics
implements Attachable, Resizable {

  public static Alpha = 0.4;
  public static readonly FontName = 'Stats';
  public static ToggleKIO = new KeyboardInputOption({ code: 'F12' });

  public readonly _onresize: () => void;
  private _size: ISize;
  public readonly _toggle: (e: KeyboardEvent) => void;

  public readonly event: utils.EventEmitter<StatsPanelEvents>;
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

  /**
   * @param resizeTo DOM Object to resize to
   */
  constructor(resizeTo?: HTMLElement | Window) {
    super();

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

    this._toggle = (e) => {
      if (StatsPanel.ToggleKIO.equal(e)) {
        if (this.visible) {
          this.detach();
        } else {
          this.attach();
        }
      }
    };

    this.event = new utils.EventEmitter();
    this.resizeTo = resizeTo || window;

    this
      .on('added', this.attach)
      .once('added', this.detach)
      .on('removed', this.detach);

    window.addEventListener('keydown', this._toggle);
  }

  public attach() {
    this.detach();

    this.visible = true;
    this._onresize();

    this.resizeTo.addEventListener('resize', this._onresize);
  }

  public detach() {
    this.visible = false;

    this.resizeTo.removeEventListener('resize', this._onresize);
  }

  public resize(width: number, height: number) {
    this.clear();
    this.beginFill(0x000000, StatsPanel.Alpha);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this._size.width = width;
    this._size.height = height;
    this.event.emit('resize', this._size);
  }
};

export interface StatsPanelEvents {
  resize: [size: ISize];
};

BitmapFont.from(
  StatsPanel.FontName,
  {
    fontFamily: 'Menlo',
    fontSize: 12,
    fontWeight: 'normal',
    fill: 0xffffff
  },
  { chars: BitmapFont.ASCII }
);
