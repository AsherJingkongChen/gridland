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
import { Attachable } from '../design/Attachable';
import { Accessor } from 'solid-js';
import {
  Eventable,
  EventEmitter
} from '../design/Eventable';

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

  constructor(
    profiles: [
      string,
      Accessor<string | number | boolean>
    ][]
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
        <div
          id="profiler"
          class="UILight"
          style={{
            'font-size': 'small',
            visibility: this.visibility()
          }}
        >
          <Show when={this.visibility() === 'visible'}>
            <For each={profiles}>
              {([key, profile]) => (
                <div>{`${key}: ${profile()}`}</div>
              )}
            </For>
          </Show>
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
