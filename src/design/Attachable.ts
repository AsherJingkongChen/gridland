export interface Attachable {
  readonly attach: () => void;
  readonly detach: () => void;
};
