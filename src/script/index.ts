import {
  Application,
  Texture,
  SCALE_MODES,
  MIPMAP_MODES
} from 'pixi.js';
import {
  Camera,
  Component,
  Profiler,
  Zone
} from '../component';
import { onCameraMove, onCameraZoom } from './Profiler';
import { updateChunks } from './Zone';
import { updateFps } from './Ticker';
import { Resource } from '../resource';
import { windowPreventDefault } from '../tool';

export const openCanvas = (option: { worldid: number }) => {
  closeCanvas();

  // [TODO] RM
  Resource.gridTexture = Texture.from(
    `./asset/${true ? 'Light' : 'Dark'}Grid.png`,
    {
      scaleMode: SCALE_MODES.NEAREST,
      mipmap: MIPMAP_MODES.ON
    }
  );

  Component.camera = new Camera();

  Component.canvas = new Application({
    autoDensity: true,
    backgroundColor: 0x000000,
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    view: document.getElementById(
      'canvas'
    ) as HTMLCanvasElement
  });

  Component.profiler = new Profiler({
    parentElement: document.getElementById(
      'overprofiler'
    ) as HTMLDivElement,

    profileKeys: [
      'LengthUnits',
      'Renderer',
      'Version',
      'chunks',
      'fps',
      'x',
      'y',
      'zoom'
    ]
  });

  Component.zone = new Zone({
    chunkPerZone: 8,
    gridPerChunk: 64,
    gridTexture: Resource.gridTexture,
    worldid: option.worldid
  });

  Component.profiler.list['LengthUnits'][1](
    `${
      Component.zone.gridPerChunk *
      Component.zone.chunkPerZone
    } Grids / ` +
      `${Component.zone.chunkPerZone} Chunks / ` +
      `1 Zone`
  );
  Component.profiler.list['Renderer'][1](
    Component.canvas.renderer.rendererLogId
  );
  Component.profiler.list['Version'][1]('0.0.8');

  Component.canvas.stage.addChild(Component.camera);
  Component.canvas.ticker.add(updateFps);

  Component.camera.stage = Component.zone;
  Component.camera.x -= window.innerWidth / 2;
  Component.camera.y -= window.innerHeight / 2;
  Component.camera.event
    .on('move', onCameraMove)
    .on('zoom', onCameraZoom)
    .on('move', updateChunks);

  Component.camera.event.emit('move', Component.camera);
  Component.camera.event.emit('zoom', Component.camera);

  windowPreventDefault('keydown');
  windowPreventDefault('wheel');
};

export const closeCanvas = () => {
  if (Resource.gridTexture) {
    Resource.gridTexture.destroy(true);
    Resource.gridTexture = undefined;
  }

  if (Component.camera) {
    Component.camera.destroy(true);
    Component.camera = undefined;
  }

  if (Component.canvas) {
    Component.canvas.destroy(false, true);
    Component.canvas = undefined;
  }

  if (Component.profiler) {
    Component.profiler.destroy();
    Component.profiler = undefined;
  }

  if (Component.zone) {
    Component.zone.destroy(true);
    Component.zone = undefined;
  }
};

export * from './Profiler';
export * from './Ticker';
export * from './Zone';
