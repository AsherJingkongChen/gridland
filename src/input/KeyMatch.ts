export const keyMatch =
  (test: KeyModifierObject, expect: KeyModifierObject) => {
    return (
      (test['key'] || '') === (expect['key'] || '') &&
      (test['altKey'] || false) === (expect['altKey'] || false) &&
      (test['ctrlKey'] || false) === (expect['ctrlKey'] || false) &&
      (test['metaKey'] || false) === (expect['metaKey'] || false) &&
      (test['shiftKey'] || false) === (expect['shiftKey'] || false)
    );
  };
  
export interface KeyModifierObject {
  key?: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export enum KeyMap {
  // [TODO]
};
