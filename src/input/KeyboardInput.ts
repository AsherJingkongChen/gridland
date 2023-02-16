/**
 * KIO
 */
export class KeyboardInputOption
implements IKeyboardInputOption {

  public code?: KeyboardInputCodes;
  public altKey?: boolean;
  public ctrlKey?: boolean;
  public metaKey?: boolean;
  public shiftKey?: boolean;

  constructor(
      options: {
        code?: KeyboardInputCodes,
        altKey?: boolean,
        ctrlKey?: boolean,
        metaKey?: boolean,
        shiftKey?: boolean
      }
    ) {

    Object.assign(this, options);
  }

  public static From(
      options: IKeyboardInputOption): KeyboardInputOption {

    const result = new KeyboardInputOption({});

    if (options.code as string in KeyboardInputCodes) {
      result.code = options.code as KeyboardInputCodes;
    }
    result.altKey = options.altKey;
    result.ctrlKey = options.ctrlKey;
    result.metaKey = options.metaKey;
    result.shiftKey = options.shiftKey;
    return result;
  }

  public static Equal(
      self: IKeyboardInputOption,
      other: IKeyboardInputOption): boolean {

    return (
      ((self.code || false) === (other.code || false)) &&
      ((self.altKey || false) === (other.altKey || false)) &&
      ((self.ctrlKey || false) === (other.ctrlKey || false)) &&
      ((self.metaKey || false) === (other.metaKey || false)) &&
      ((self.shiftKey || false) === (other.shiftKey || false))
    );
  }

  public equal(other: IKeyboardInputOption): boolean {
    return KeyboardInputOption.Equal(this, other);
  }
};

/**
 * KIO, compatible to KeyboardEvent, MouseEvent and etc.
 */
export interface IKeyboardInputOption {
  code?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

/**
 * Enum for values of KeyboardEvent.code
 */
export const KeyboardInputCodes = {
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

export type KeyboardInputCodes =
  keyof typeof KeyboardInputCodes;
