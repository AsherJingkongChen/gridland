/**
 * KIO
 * 
 * Type to compare with types including
 * KeyboardEvent, MouseEvent and etc.
 */
export class KeyboardInputOption
implements IKeyboardInputOption {

  public code?: KeyboardInputCodes;
  public altKey: boolean;
  public ctrlKey: boolean;
  public metaKey: boolean;
  public shiftKey: boolean;

  /**
   * Build a KeyboardInputOption object from `options`
   * 
   * @param options.code
   * must be one of KeyboardInputCodes
   */
  constructor(
      options?: {
        code?: KeyboardInputCodes,
        altKey?: boolean,
        ctrlKey?: boolean,
        metaKey?: boolean,
        shiftKey?: boolean
      }
    ) {

    this.code = options?.code;
    this.altKey = options?.altKey || false;
    this.ctrlKey = options?.ctrlKey || false;
    this.metaKey = options?.metaKey || false;
    this.shiftKey = options?.shiftKey || false;
  }

  /**
   * Build a KeyboardInputOption object
   * from an IKeyboardInputOption onject
   * 
   * @param other.code
   * must be one of KeyboardInputCodes,
   * otherwise KeyboardInputOption.code will be undefined
   */
  public static From(
      other?: IKeyboardInputOption
    ): KeyboardInputOption {

    return (
      new KeyboardInputOption({
        code: (other?.code as string in KeyboardInputCodes)?
              (other?.code as KeyboardInputCodes): (undefined),
        altKey: other?.altKey,
        ctrlKey: other?.ctrlKey,
        metaKey: other?.metaKey,
        shiftKey: other?.shiftKey
      })
    );
  }

  /**
   * Compare two IKeyboardInputOption objects
   */
  public static Equal(
      other: IKeyboardInputOption,
      another: IKeyboardInputOption): boolean {

    return (
      (other.code === another.code) &&
      ((other.altKey || false) === (another.altKey || false)) &&
      ((other.ctrlKey || false) === (another.ctrlKey || false)) &&
      ((other.metaKey || false) === (another.metaKey || false)) &&
      ((other.shiftKey || false) === (another.shiftKey || false))
    );
  }

  /**
   * Compare to the other IKeyboardInputOption object
   */
  public equal(other: IKeyboardInputOption): boolean {
    return KeyboardInputOption.Equal(this, other);
  }
};

/**
 * IKIO
 * 
 * Interface that is compatible to types including
 * KeyboardEvent, MouseEvent and etc.
 */
export interface IKeyboardInputOption {
  code?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

/**
 * Valid values of KeyboardEvent.code
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

/**
 * Valid values of KeyboardEvent.code
 */
export type KeyboardInputCodes =
  keyof typeof KeyboardInputCodes;
