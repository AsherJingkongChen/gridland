import { EventEmitter } from '@pixi/utils';

export interface Eventable<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  Context = any
> {
  event: EventEmitter<EventTypes, Context>;
}

export { EventEmitter } from '@pixi/utils';
