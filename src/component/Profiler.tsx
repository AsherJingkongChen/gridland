import { For, onCleanup, onMount, Show } from 'solid-js';
import {
  CSSClass,
  KeyInput,
  createSignal,
  Signal,
  createLifecycle
} from '../entity';
import { EventEmitter } from 'eventemitter3';

//
// [Reactive Component Style for JSX]
//
// export const createComponent = (option?) => {
//   const [accessor, setter] = createSignal(...);
//
//   const [mount, clean] = createLifecycle(() => {
//     onMount(() => {
//       // init
//     });
//
//     onCleanup(() => {
//       // deinit
//     });
//
//     return (
//       <!-- JSX.Element -->
//     );
//   });
//
//   return {
//     mount,
//     clean,
//
//     accessor,
//     setter
//   };
// };
//

/**
 * @param option.keys
 * String keys to access the corresponding profile in `list`
 * By default it's []
 *
 * @param option.toggleKeyInput
 * The KeyInput to toggle on/off, by default it's { F12 }
 */
export const createProfiler = (option?: {
  keys?: string[];
  toggleKeyInput?: KeyInput;
}) => {
  const [event] = createSignal(
    new EventEmitter<_ProfilerEvents>()
  );

  const [list, setList] = createSignal(
    new Map<string, Signal<string>>(
      (option?.keys ?? []).map((key) => [
        key,
        createSignal('')
      ])
    )
  );

  const [toggleKeyInput, setToggleKeyInput] = createSignal(
    option?.toggleKeyInput ?? new KeyInput({ code: 'F12' })
  );

  const [visibility, setVisibility] = createSignal(
    'hidden' as DocumentVisibilityState
  );

  const _toggle = (e: KeyboardEvent) => {
    if (toggleKeyInput().equal(e)) {
      setVisibility(
        visibility() === 'hidden' ? 'visible' : 'hidden'
      );
      event().emit('toggle', visibility());
    }
  };

  const [mount, clean] = createLifecycle(() => {
    onMount(() => {
      window.addEventListener('keydown', _toggle);
    });

    onCleanup(() => {
      window.removeEventListener('keydown', _toggle);

      event().removeAllListeners();

      for (const [_, setProfile] of Object.values(list())) {
        setProfile('');
      }

      setVisibility('hidden');
    });

    return (
      // [TODO] Why do we need NoPointerEvents outer class?
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
            visibility: visibility()
          }}
        >
          <Show when={visibility() === 'visible'}>
            <For each={[...list().entries()]}>
              {([key, [profile]]) => (
                <div>{`${key}: ${profile()}`}</div>
              )}
            </For>
          </Show>
        </div>
      </div>
    );
  });

  return {
    mount,
    clean,

    event,
    list,
    toggleKeyInput,
    visibility,

    setList,
    setToggleKeyInput,
    setVisibility
  };
};

type _ProfilerEvents = {
  toggle: [visibility: DocumentVisibilityState];
};
