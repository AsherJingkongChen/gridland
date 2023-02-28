import { KeyboardInputOption } from '../entity';
import { Graphics, ISize } from 'pixi.js';
import {
  Attachable,
  Eventable,
  EventEmitter,
  Resizable
} from '../design';
import { windowPreventDefault } from '../tool';

windowPreventDefault('keydown');

/**
 * View for profiles
 */
export class Profiler
  extends Graphics
  implements
    Attachable,
    Eventable<ProfilerEvents>,
    Resizable
{
  public event: EventEmitter<ProfilerEvents>;
  public toggleKIO: KeyboardInputOption;

  private _opacity: number;
  private _size: ISize;
  private readonly _toggle: (e: KeyboardEvent) => void;

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
   * Virtual width, irrevalent to scale
   */
  public override get width(): number {
    return this._size.width;
  }

  /**
   * Virtual width, irrevalent to scale
   */
  public override set width(width: number) {
    this.resize(width, this.height);
  }

  /**
   * @param option.opacity
   * Alpha of background, by default it's 0.35
   *
   * @param option.toggleKIO
   * KIO to toggle Profiler to show or not, by default it's { F12 }
   */
  constructor(option?: {
    opacity?: number;
    toggleKIO?: KeyboardInputOption;
  }) {
    super();

    this._opacity = option?.opacity || 0.35;
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

    this.event = new EventEmitter();

    this.toggleKIO =
      option?.toggleKIO ||
      new KeyboardInputOption({ code: 'F12' });

    this.on('added', this.attach)
      .once('added', this.detach)
      .on('removed', this.detach);

    window.addEventListener('keydown', this._toggle);
  }

  public override destroy() {
    super.destroy({ children: true });

    this.detach();
    window.removeEventListener('keydown', this._toggle);

    this._opacity = 0;

    (this._size as unknown) = undefined;
    (this._toggle as unknown) = undefined;

    this.event.removeAllListeners();
    (this.event as unknown) = undefined;

    (this.toggleKIO as unknown) = undefined;
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
}

export interface ProfilerEvents {
  resize: [size: ISize];
}
