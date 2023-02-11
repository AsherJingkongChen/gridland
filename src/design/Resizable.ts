export interface Resizable {
  _resize: <K extends keyof WindowEventMap>(this: Window, ev: WindowEventMap[K]) => any
};
