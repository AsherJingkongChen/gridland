import { Eventable } from '../design/Eventable';
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
implements
    Attachable,
    Eventable<StatsPanelEvents>,
    Resizable {

  public static readonly DefaultFontName = 'Stats';
  
  private _opacity: number;
  private _size: ISize;
  private readonly _toggle: (e: KeyboardEvent) => void;
  
  public event: utils.EventEmitter<StatsPanelEvents>;
  public toggleKIO: KeyboardInputOption;

  /**
   * Virtual width, irrevalent to scale
   */
  public override get width() : number {
    return this._size.width;
  }

  /**
   * Virtual width, irrevalent to scale
   */
  public override set width(width: number) {
    this.resize(width, this.height);
  }

  /**
   * Virtual height, irrevalent to scale
   */
  public override get height(): number {
    return this._size.height;
  }

  /**
   * Virtual height, irrevalent to scale
   */
  public override set height(height: number) {
    this.resize(this.width, height);
  }

  /**
   * Alpha of background
   */
  public get opacity(): number {
    return this._opacity;
  }

  /**
   * Alpha of background
   */
  public set opacity(opacity: number) {
    this._opacity = opacity;
    this.resize(this.width, this.height);
  }

  /**
   * @param options.opacity
   * Alpha of background, by default it's 0.35
   * 
   * @param options.toggleKIO
   * KIO to toggle StatsPanel to show or not, by default it's { F12 }
   */
  constructor(
      options?: {
        opacity?: number,
        toggleKIO?: KeyboardInputOption
      }
    ) {

    super();

    this._opacity = options?.opacity || 0.35;
    this._size = { width: 0, height: 0 };

    this._toggle = (e) => {
      if (this.toggleKIO.equal(e)) {
        if (this.visible) {
          this.detach();
        } else {
          this.attach();
        }
      }
    };

    this.event = new utils.EventEmitter();

    this.toggleKIO =
      options?.toggleKIO ||
      new KeyboardInputOption({ code: 'F12' });

    this
      .on('added', this.attach)
      .once('added', this.detach)
      .on('removed', this.detach);

    window.addEventListener('keydown', this._toggle);
  }

  public override destroy() {
    super.destroy();
    this.detach();
    window.removeEventListener('keydown', this._toggle);

    this._opacity = 0;
    (this._size as any) = undefined;
    (this._toggle as any) = undefined;

    this.event.removeAllListeners();
    (this.event as any) = undefined;
    (this.toggleKIO as any) = undefined;
  }

  public attach() {
    this.detach();

    this.visible = true;
  }

  public detach() {
    this.visible = false;
  }

  /**
   * Redraw background
   */
  public resize(width: number, height: number) {
    this.clear();
    this.beginFill(0x000000, this.opacity);
    super.drawRect(0, 0, width, height);
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
  StatsPanel.DefaultFontName,
  {
    fontFamily: 'Monaco',
    fontSize: 12,
    fontWeight: 'normal',
    fill: 0xffffff,
  },
  { chars: BitmapFont.ASCII }
);
