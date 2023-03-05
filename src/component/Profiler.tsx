import {
  createSignal,
  For,
  JSX,
  onCleanup,
  Setter,
  Show
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

windowPreventDefault('keydown');

export class Profiler
  implements Attachable, Eventable<ProfilerEvents>
{
  public event: EventEmitter<ProfilerEvents>;
  public readonly render: () => JSX.Element;
  public toggleKI: KeyInput;
  public readonly visibility: Accessor<DocumentVisibilityState>;
  public readonly setVisibility: Setter<DocumentVisibilityState>;

  private _toggle: (e: KeyboardEvent) => void;

  /**
   * @param profileBlocks
   * Blocks of profiles, each profile is a pair of [string, Accessor],
   * and the bottom of each block has a <br/> tag
   */
  constructor(
    profileBlocks: [
      string,
      Accessor<string | number | boolean>
    ][][]
  ) {
    this._toggle = (e: KeyboardEvent) => {
      if (this.toggleKI.equal(e)) {
        const on = this.visibility() === 'hidden';
        this.setVisibility(on ? 'visible' : 'hidden');
        this.event.emit('toggle', on);
      }
    };

    this.event = new EventEmitter();

    this.render = () => {
      this.attach();
      onCleanup(() => this.detach());

      return (
        <div class={CSSClass.NoPointerEvents}>
          <div
            id="profiler"
            class={
              `${CSSClass.RegularText} ` +
              (true
                ? CSSClass.LightProfiler
                : CSSClass.DarkProfiler)
            }
            style={{
              'font-size': '0.8rem',
              visibility: this.visibility() // [TODO] Resize, text wrapping
            }}
          >
            <Show when={this.visibility() === 'visible'}>
              <For each={profileBlocks}>
                {(profiles) => (
                  <>
                    <For each={profiles}>
                      {([key, profile]) => (
                        <div>{`${key}: ${profile()}`}</div>
                      )}
                    </For>
                    <br />
                  </>
                )}
              </For>
            </Show>
          </div>
        </div>
      );
    };

    this.toggleKI = new KeyInput({ code: 'F12' });

    [this.visibility, this.setVisibility] =
      createSignal('hidden');
  }

  public attach() {
    this.detach();

    window.addEventListener('keydown', this._toggle);
  }

  public detach() {
    window.removeEventListener('keydown', this._toggle);
  }
}

export interface ProfilerEvents {
  toggle: [on: boolean];
}
