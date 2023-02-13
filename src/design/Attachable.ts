/**
 * Do detaching before attaching
 */
export interface Attachable {
  attach(): void;
  detach(): void;
};
