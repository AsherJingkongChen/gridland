/**
 * Detach before attach
 */
export interface Attachable {
  attach(): void;
  detach(): void;
}
