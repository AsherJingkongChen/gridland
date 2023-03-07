import {
  createSignal,
  For,
  onCleanup,
  Setter,
  Show,
  Signal
} from 'solid-js';
import { KeyInput } from '../entity';
import { windowPreventDefault } from '../tool';
import { Attachable } from '../design';
import { Accessor } from 'solid-js';
import {
  Eventable,
  EventEmitter
} from '../design/Eventable';
import { CSSClass } from '../entity/CSSClass';
import { MountableElement, render } from 'solid-js/web';
import { Destroyable } from '../design/Destroyable';

windowPreventDefault('keydown');

export class Profiler
  implements
    Attachable,
    Destroyable,
    Eventable<_ProfilerEvents>
{
  public readonly event: EventEmitter<_ProfilerEvents>;
  public list: Record<string, Signal<string>>;
  public toggleKI: KeyInput;
  public readonly visibility: Accessor<DocumentVisibilityState>;
  public readonly setVisibility: Setter<DocumentVisibilityState>;

  private _destroyed: boolean;
  private readonly _dispose: () => void;
  private readonly _toggle: (e: KeyboardEvent) => void;

  public get destroyed(): boolean {
    return this._destroyed;
  }

  /**
   * @param option.parentElement
   * The element to render under, by default it's document.body
   *
   * @param option.profileKeys
   * Each profile key is a string.
   * Profiles can be accessed with these keys.
   * By default it's []
   */
  constructor(option: {
    parentElement: MountableElement;
    profileKeys?: string[];
  }) {
    this._destroyed = false;

    this._toggle = (e: KeyboardEvent) => {
      if (this.toggleKI.equal(e)) {
        const on = this.visibility() === 'hidden';
        this.setVisibility(on ? 'visible' : 'hidden');
        this.event.emit('toggle', on);
      }
    };

    this.event = new EventEmitter();

    this.list = {};
    for (const key of option?.profileKeys ?? []) {
      this.list[key] = createSignal('');
    }

    this.toggleKI = new KeyInput({ code: 'F12' });

    [this.visibility, this.setVisibility] =
      createSignal('hidden');

    this._dispose = render(() => {
      this.attach();
      onCleanup(() => this.detach());

      return (
        <div class={CSSClass.NoPointerEvents}>
          <div
            class={
              `${CSSClass.RegularText} ` +
              `${CSSClass.FullScreen} ` +
              (true
                ? CSSClass.LightProfiler
                : CSSClass.DarkProfiler)
            }
            style={{
              'font-size': '0.8rem',
              padding: '0.5rem',
              visibility: this.visibility()
            }}
          >
            <Show when={this.visibility() === 'visible'}>
              <For each={Object.entries(this.list)}>
                {([key, profile]) => (
                  <div>{`${key}: ${profile[0]()}`}</div>
                )}
              </For>
            </Show>
          </div>
        </div>
      );
    }, option.parentElement);
  }

  public destroy(): void {
    if (!this.destroyed) {
      this._destroyed = true;
      this._dispose();
      (this._dispose as unknown) = undefined;
      (this._toggle as unknown) = undefined;

      this.event.removeAllListeners();
      (this.event as unknown) = undefined;
      for (const key in this.list) {
        delete this.list[key];
      }
      (this.list as unknown) = undefined;
      (this.toggleKI as unknown) = undefined;
      (this.visibility as unknown) = undefined;
      (this.setVisibility as unknown) = undefined;
    }
  }

  public attach(): void {
    this.detach();

    window.addEventListener('keydown', this._toggle);
  }

  public detach(): void {
    window.removeEventListener('keydown', this._toggle);
  }
}

interface _ProfilerEvents {
  toggle: [on: boolean];
}
