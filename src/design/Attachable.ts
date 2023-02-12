/**
 * Do detaching before attaching
 */
export interface Attachable {
  readonly attach: () => void;
  readonly detach: () => void;
};
