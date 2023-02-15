/**
 * KIO
 */
export class KeyboardInputOption
implements IKeyboardInputOption {

  public code?: KeyboardInputCodeMap;
  public altKey?: boolean;
  public ctrlKey?: boolean;
  public metaKey?: boolean;
  public shiftKey?: boolean;

  constructor(
      options:
        IKeyboardInputOption &
        { code?: KeyboardInputCodeMap }) {

    Object.assign(this, options);
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
 * KIO
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
export type KeyboardInputCodeMap =
  'Backquote' |
  'Digit1' |
  'Digit2' |
  'Digit3' |
  'Digit4' |
  'Digit5' |
  'Digit6' |
  'Digit7' |
  'Digit8' |
  'Digit9' |
  'Digit0' |
  'Minus' |
  'Equal' |

  'KeyQ' |
  'KeyW' |
  'KeyE' |
  'KeyR' |
  'KeyT' |
  'KeyY' |
  'KeyU' |
  'KeyI' |
  'KeyO' |
  'KeyP' |
  'BracketLeft' |
  'BracketRight' |
  'Backslash' |

  'KeyA' |
  'KeyS' |
  'KeyD' |
  'KeyF' |
  'KeyG' |
  'KeyH' |
  'KeyJ' |
  'KeyK' |
  'KeyL' |
  'Semicolon' |
  'Quote' |

  'KeyZ' |
  'KeyX' |
  'KeyC' |
  'KeyV' |
  'KeyB' |
  'KeyN' |
  'KeyM' |
  'Comma' |
  'Period' |
  'Slash' |

  'Escape' |
  'F1' |
  'F2' |
  'F3' |
  'F4' |
  'F5' |
  'F6' |
  'F7' |
  'F8' |
  'F9' |
  'F10' |
  'F12' |
  'Backspace' |
  'Tab' |
  'CapsLock' |
  'Enter' |
  'Space' |
  'ArrowLeft' |
  'ArrowUp' |
  'ArrowDown' |
  'ArrowRight';
