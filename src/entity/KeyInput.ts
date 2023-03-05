export type KeyInputCreateOption = {
  code?: KeyInputCodes;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

/**
 * It's compatible to types including
 * KeyboardEvent, MouseEvent and etc.
 */
export type KeyInputReadOption = {
  code?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

/**
 * KeyInput a.k.a. KI
 *
 * It's comparable with types including
 * KeyboardEvent, MouseEvent and etc.
 */
export class KeyInput
  implements KeyInputCreateOption, KeyInputReadOption
{
  public code?: KeyInputCodes;
  public altKey: boolean;
  public ctrlKey: boolean;
  public metaKey: boolean;
  public shiftKey: boolean;

  /**
   * Build from a KeyInputCreateOption
   *
   * @param option.code
   * must be one of KeyInputCodes
   */
  constructor(option?: KeyInputCreateOption) {
    this.code = option?.code;
    this.altKey = option?.altKey ?? false;
    this.ctrlKey = option?.ctrlKey ?? false;
    this.metaKey = option?.metaKey ?? false;
    this.shiftKey = option?.shiftKey ?? false;
  }

  /**
   * Build from a KeyInputReadOption
   *
   * @param option.code
   * must be one of KeyInputCodes,
   * otherwise KeyInput.code will be undefined
   */
  public static From(
    option?: KeyInputReadOption
  ): KeyInput {
    return new KeyInput({
      code:
        (option?.code as string) in KeyInputCodes
          ? (option?.code as KeyInputCodes)
          : undefined,
      altKey: option?.altKey,
      ctrlKey: option?.ctrlKey,
      metaKey: option?.metaKey,
      shiftKey: option?.shiftKey
    });
  }

  /**
   * Compare two KeyInputReadOptions
   */
  public static Equal(
    input1: KeyInputReadOption,
    input2: KeyInputReadOption
  ): boolean {
    return (
      input1.code === input2.code &&
      (input1.altKey ?? false) ===
        (input2.altKey ?? false) &&
      (input1.ctrlKey ?? false) ===
        (input2.ctrlKey ?? false) &&
      (input1.metaKey ?? false) ===
        (input2.metaKey ?? false) &&
      (input1.shiftKey ?? false) ===
        (input2.shiftKey ?? false)
    );
  }

  /**
   * Compare to the other KeyInputReadOption
   */
  public equal(input: KeyInputReadOption): boolean {
    return KeyInput.Equal(this, input);
  }
}

/**
 * A set of Valid values for KeyboardEvent.code
 */
export const KeyInputCodes = {
  Backquote: undefined,
  Digit1: undefined,
  Digit2: undefined,
  Digit3: undefined,
  Digit4: undefined,
  Digit5: undefined,
  Digit6: undefined,
  Digit7: undefined,
  Digit8: undefined,
  Digit9: undefined,
  Digit0: undefined,
  Minus: undefined,
  Equal: undefined,

  KeyQ: undefined,
  KeyW: undefined,
  KeyE: undefined,
  KeyR: undefined,
  KeyT: undefined,
  KeyY: undefined,
  KeyU: undefined,
  KeyI: undefined,
  KeyO: undefined,
  KeyP: undefined,
  BracketLeft: undefined,
  BracketRight: undefined,
  Backslash: undefined,

  KeyA: undefined,
  KeyS: undefined,
  KeyD: undefined,
  KeyF: undefined,
  KeyG: undefined,
  KeyH: undefined,
  KeyJ: undefined,
  KeyK: undefined,
  KeyL: undefined,
  Semicolon: undefined,
  Quote: undefined,

  KeyZ: undefined,
  KeyX: undefined,
  KeyC: undefined,
  KeyV: undefined,
  KeyB: undefined,
  KeyN: undefined,
  KeyM: undefined,
  Comma: undefined,
  Period: undefined,
  Slash: undefined,

  Escape: undefined,
  F1: undefined,
  F2: undefined,
  F3: undefined,
  F4: undefined,
  F5: undefined,
  F6: undefined,
  F7: undefined,
  F8: undefined,
  F9: undefined,
  F10: undefined,
  F12: undefined,
  Backspace: undefined,
  Tab: undefined,
  CapsLock: undefined,
  Enter: undefined,
  Space: undefined,
  ArrowLeft: undefined,
  ArrowUp: undefined,
  ArrowDown: undefined,
  ArrowRight: undefined
} as const;

/**
 * Valid values of KeyboardEvent.code
 */
export type KeyInputCodes = keyof typeof KeyInputCodes;
