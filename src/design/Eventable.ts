import { utils } from 'pixi.js';

export interface Eventable<
    EventTypes extends utils.EventEmitter.ValidEventTypes = string | symbol,
    Context extends any = any
  > {

  event: utils.EventEmitter<EventTypes, Context>;
}