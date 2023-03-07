import { Camera } from './Camera';
import { Profiler } from './Profiler';
import { Zone } from './Zone';
import { Application } from 'pixi.js';

export const Component: {
  camera?: Camera;
  canvas?: Application;
  profiler?: Profiler;
  zone?: Zone;
} = {};

export * from './Camera';
export * from './Profiler';
export * from './Zone';
