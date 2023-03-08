import { JSX } from 'solid-js/jsx-runtime';
import { MountableElement, render } from 'solid-js/web';

export type Cleaner = () => void;
export type Lifecycle = [Mounter, Cleaner];
export type Mounter = (
  element: MountableElement
) => Cleaner;

export const createLifecycle = (
  code: () => JSX.Element
): Lifecycle => {
  let _dispose = () => {};

  return [
    (element: MountableElement) => {
      _dispose();
      return (_dispose = render(code, element));
    },
    () => {
      _dispose();
      _dispose = () => {};
    }
  ];
};
