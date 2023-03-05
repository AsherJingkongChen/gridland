import { LengthUnit } from '../entity/Unit';
import { Application } from 'pixi.js';
import { createSignal } from 'solid-js';
import { db, World } from '../database';
import { Camera } from './Camera';
import { Profiler } from './Profiler';
import { Zone } from './Zone';

export const app = new Application({
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById(
    'stage'
  ) as HTMLCanvasElement
});

await db.delete(); // [TODO]
await db.open();

export const zone = new Zone(
  (
    (await db.worlds.get(
      await db.worlds.add(
        new World({
          name: Math.random().toString(36).substring(2, 8) // [TODO]
        })
      )
    )) as World
  ).id
);

export const camera = new Camera({
  stage: zone
});

const [_lengthUnit] = createSignal(
  `${LengthUnit.PixelPerZone} Pixels / ` +
    `${LengthUnit.GridPerZone} Grids / ` +
    `${LengthUnit.ChunkPerZone} Chunks / ` +
    `1 Zone`
);
const [_renderer] = createSignal(
  app.renderer.rendererLogId
);
const [_version] = createSignal('0.0.7');
const [_chunks, _setChunks] = createSignal(0);
const [_fps, _setFps] = createSignal('');
const [_x, _setX] = createSignal('');
const [_y, _setY] = createSignal('');
const [_zoom, _setZoom] = createSignal('');

export const profiles = {
  get: {
    lengthUnit: _lengthUnit,
    renderer: _renderer,
    version: _version,
    chunks: _chunks,
    fps: _fps,
    x: _x,
    y: _y,
    zoom: _zoom
  },
  set: {
    chunks: _setChunks,
    fps: _setFps,
    x: _setX,
    y: _setY,
    zoom: _setZoom
  }
};

export const profiler = new Profiler([
  [
    ['LengthUnit', _lengthUnit],
    ['Renderer', _renderer],
    ['Version', _version]
  ],
  [
    ['chunks', _chunks],
    ['fps', _fps],
    ['x', _x],
    ['y', _y],
    ['zoom', _zoom]
  ]
]);
