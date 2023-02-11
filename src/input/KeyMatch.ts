export const keyMatch =
  (e: KeyEvent | ModifierEvent,
   pattern: KeyMatchOption) => {

    if ((pattern.key || '') !== (e['key'] || '')) {
      return false;
    }

    if (pattern.modifier === undefined) {
      for (const mod in ModifierMap) {
        if (e[mod]) {
          return false;
        }
      }
    } else {
      for (const mod in ModifierMap) {
        if ((pattern.modifier[mod] || false) !== (e[mod] || false)) {
          return false;
        }
      }
    }      

    return true;
  };

export interface KeyMatchOption {
  key?: string;
  modifier?: { [_ in ModifierMap]?: boolean };
};

export enum ModifierMap {
  metaKey = 'metaKey',
  ctrlKey = 'ctrlKey',
  altKey = 'altKey',
  shiftKey = 'shiftKey',
};

export enum KeyMap {
  // [TODO]
};

export interface KeyEvent {
  readonly key: string;
};

export interface ModifierEvent {
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
  readonly altKey: boolean;
  readonly shiftKey: boolean;
};
