export interface IKeyModifierOption {
  key?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

export class KeyModifierOption implements IKeyModifierOption {
  public key?: string;
  public altKey?: boolean;
  public ctrlKey?: boolean;
  public metaKey?: boolean;
  public shiftKey?: boolean;

  constructor(from: IKeyModifierOption) {
    Object.assign(this, from);
  }

  public static Equal(
      self: IKeyModifierOption,
      other: IKeyModifierOption): boolean {

    return (
      ((self.key || '') === (other.key || '')) &&
      ((self.altKey || false) === (other.altKey || false)) &&
      ((self.ctrlKey || false) === (other.ctrlKey || false)) &&
      ((self.metaKey || false) === (other.metaKey || false)) &&
      ((self.shiftKey || false) === (other.shiftKey || false))
    );
  }

  public equal(other: IKeyModifierOption): boolean {
    return KeyModifierOption.Equal(this, other);
  }
};

export enum KeyMap {
  // [TODO]
};
