import { EventEmitter } from '@pixi/utils';

export interface Eventable<
  EventTypes extends EventEmitter.ValidEventTypes =
    | string
    | symbol,
  Context = unknown
> {
  readonly event: EventEmitter<EventTypes, Context>;
}

export { EventEmitter } from '@pixi/utils';
