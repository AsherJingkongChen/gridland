// import { Camera } from './Camera';
// import { Profiler } from './Profiler';
// import { Zone } from './Zone';
// import {
//   Application,
//   Texture,
//   SCALE_MODES,
//   MIPMAP_MODES
// } from 'pixi.js';
// import {
//   onCameraMove,
//   onCameraZoom,
//   updateChunks,
//   updateFps
// } from '../script';
// import { Resource } from '../resource';
// import { windowPreventDefault } from '../tool';

// export class AppV1 {
//   private _camera?: Camera;
//   private _canvas?: Application;
//   private _isWorldOpen: boolean;
//   private _profiler?: Profiler;
//   private _zone?: Zone;

//   public get camera(): Camera | undefined {
//     return this._camera;
//   }

//   public get canvas(): Application | undefined {
//     return this._canvas;
//   }

//   public get isWorldOpen(): boolean {
//     return this._isWorldOpen;
//   }

//   public get profiler(): Profiler | undefined {
//     return this._profiler;
//   }

//   public get zone(): Zone | undefined {
//     return this._zone;
//   }

//   constructor() {
//     this._isWorldOpen = true;
//   }

//   public openWorld(option: { worldid: number }): void {
//     if (this._isWorldOpen === true) {
//       this.closeWorld();
//     }

//     // [TODO] RM
//     Resource.gridTexture = Texture.from(
//       `./asset/${true ? 'Light' : 'Dark'}Grid.png`,
//       {
//         scaleMode: SCALE_MODES.NEAREST,
//         mipmap: MIPMAP_MODES.ON
//       }
//     );

//     this._camera = new Camera();

//     this._canvas = new Application({
//       autoDensity: true,
//       backgroundColor: 0x000000,
//       resizeTo: window,
//       resolution: window.devicePixelRatio || 1,
//       view: document.getElementById(
//         'canvas'
//       ) as HTMLCanvasElement
//     });

//     this._profiler = new Profiler({
//       parentElement: document.getElementById(
//         'overprofiler'
//       ) as HTMLDivElement,

//       profileKeys: [
//         'LengthUnits',
//         'Renderer',
//         'Version',
//         'chunks',
//         'fps',
//         'x',
//         'y',
//         'zoom'
//       ]
//     });

//     this._zone = new Zone({
//       chunkPerZone: 8,
//       gridPerChunk: 64,
//       gridTexture: Resource.gridTexture,
//       worldid: option.worldid
//     });

//     this._profiler.list['LengthUnits'][1](
//       `${
//         this._zone.gridPerChunk * this._zone.chunkPerZone
//       } Grids / ` +
//         `${this._zone.chunkPerZone} Chunks / ` +
//         `1 Zone`
//     );
//     this._profiler.list['Renderer'][1](
//       this._canvas.renderer.rendererLogId
//     );
//     this._profiler.list['Version'][1]('0.0.8');

//     this._canvas.stage.addChild(this._camera);
//     this._canvas.ticker.add(updateFps);

//     this._camera.stage = this._zone;
//     this._camera.x -= window.innerWidth / 2;
//     this._camera.y -= window.innerHeight / 2;
//     this._camera.event
//       .on('move', onCameraMove)
//       .on('zoom', onCameraZoom)
//       .on('move', updateChunks);

//     this._camera.event.emit('move', this._camera);
//     this._camera.event.emit('zoom', this._camera);

//     windowPreventDefault('keydown');
//     windowPreventDefault('wheel');

//     this._isWorldOpen = true;
//   }

//   public closeWorld(): void {
//     if (this._isWorldOpen === false) {
//       return;
//     }
//     this._isWorldOpen = false;

//     if (Resource.gridTexture) {
//       Resource.gridTexture.destroy(true);
//       Resource.gridTexture = undefined;
//     }

//     if (this._camera) {
//       this._camera.destroy(true);
//       this._camera = undefined;
//     }

//     if (this._canvas) {
//       this._canvas.destroy(false, true);
//       this._canvas = undefined;
//     }

//     if (this._profiler) {
//       this._profiler.destroy();
//       this._profiler = undefined;
//     }

//     if (this._zone) {
//       this._zone.destroy(true);
//       this._zone = undefined;
//     }
//   }
// }
