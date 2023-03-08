import {
  Accessor,
  Setter,
  Signal,
  createSignal,
  SignalOptions
} from 'solid-js';

export type OptionalAccessor<T> = Accessor<T | undefined>;
export type OptionalSetter<T> = Setter<T | undefined>;
export type OptionalSignal<T> = Signal<T | undefined>;

export function createOptionalSignal<T>(
  value?: T | undefined,
  options?: SignalOptions<T | undefined>
): OptionalSignal<T> {
  return createSignal(value, options);
}

export {
  Accessor,
  Setter,
  Signal,
  createSignal,
  SignalOptions
} from 'solid-js';
