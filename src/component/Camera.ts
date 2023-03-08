// import { EventEmitter } from 'eventemitter3';
// import {
//   createOptionalSignal,
//   KeyInput,
//   OptionalAccessor,
//   OptionalSetter,
//   Accessor,
//   createSignal,
//   Setter
// } from '../entity';
// import {
//   Container,
//   DisplayObject,
//   FederatedMouseEvent,
//   FederatedWheelEvent,
//   IPointData,
//   Point
// } from 'pixi.js';
// import { windowPreventDefault } from '../tool';

// windowPreventDefault('keydown');
// windowPreventDefault('wheel');

// export const createCamera = (option?: {
//   maxZoom?: number;
//   minZoom?: number;
//   stage?: DisplayObject;
//   swipeKeyInput?: KeyInput;
//   zoominKeyInput?: KeyInput;
//   zoomoutKeyInput?: KeyInput;
//   zoomWheelKeyInput?: KeyInput;
// }) => {
//   const [dragging, setDragging] =
//     createSignal(false);

//   const [event, setEvent] = createSignal(
//     new EventEmitter()
//   );

//   const [maxZoom, setMaxZoom] = createSignal(
//     option?.maxZoom ?? 15.0
//   );

//   const [minZoom, setMinZoom] = createSignal(
//     option?.minZoom ?? 0.25
//   );

//   const [pointer, setPointer] =
//     createSignal(new Point());

//   const [swipeKeyInput, setSwipeKeyInput] =
//     createOptionalSignal(new KeyInput());

//   const [zoomInKeyInput, setZoomInKeyInput] =
//     createOptionalSignal(new KeyInput({ code: 'Equal' }));

//   const [zoomOutKeyInput, setZoomOutKeyInput] =
//     createOptionalSignal(new KeyInput({ code: 'Minus' }));

//   const [zoomWheelKeyInput, setZoomWheelKeyInput] =
//     createOptionalSignal(new KeyInput({ ctrlKey: true }));

//   this._viewport = new Container();
//   this._zoomWheel = (e) => {
//     if (this.zoomInKeyInput()?.equal(e) === true) {
//       this._zoomOnWindow(+16);
//     } else if (this.zoomOutKeyInput()?.equal(e) === true) {
//       this._zoomOnWindow(-16);
//     }
//   };

//   this.addChild(this._viewport);
//   this.stage = option?.stage;

//   this.on('added', this.attach).on('removed', this.detach);
//   //   const [accessor, setter] = createSignal(...);
//   //
//   //   const [mount, clean] = createLifecycle(() => {
//   //     onMount(() => {
//   //       // init
//   //     });
//   //
//   //     onCleanup(() => {
//   //       // deinit
//   //     });
//   //
//   //     return (
//   //       <!-- JSX.Element -->
//   //     );
//   //   });
//   //
//   //   return {
//   //     mount,
//   //     clean,
//   //
//   //     accessor,
//   //     setter
//   //   };
// };

// /**
//  * Simple auto camera, moves via x and y, zooms via zoom
//  */
// export class Camera extends Container {
//   public readonly dragging: Accessor<boolean>;
//   public readonly setDragging: Setter<boolean>;

//   public readonly event: Accessor<
//     EventEmitter<_CameraEvents>
//   >;
//   public readonly setEvent: Setter<
//     EventEmitter<_CameraEvents>
//   >;

//   public readonly maxZoom: Accessor<number>;
//   public readonly setMaxZoom: Setter<number>;

//   public readonly minZoom: Accessor<number>;
//   public readonly setMinZoom: Setter<number>;

//   public readonly pointer: Accessor<IPointData>;
//   public readonly setPointer: Setter<IPointData>;

//   public readonly swipeKeyInput: OptionalAccessor<KeyInput>;
//   public readonly setSwipeKeyInput: OptionalSetter<KeyInput>;

//   public readonly zoomInKeyInput: OptionalAccessor<KeyInput>;
//   public readonly setZoomInKeyInput: OptionalSetter<KeyInput>;

//   public readonly zoomOutKeyInput: OptionalAccessor<KeyInput>;
//   public readonly setZoomOutKeyInput: OptionalSetter<KeyInput>;

//   public readonly zoomWheelKeyInput: OptionalAccessor<KeyInput>;
//   public readonly setZoomWheelKeyInput: OptionalSetter<KeyInput>;

//   private _viewport: Container;
//   private _zoomWheel?: (e: KeyboardEvent) => void;

//   /**
//    * Camera's target DisplayObject
//    */
//   public get stage(): DisplayObject | undefined {
//     return this._viewport?.children[0];
//   }

//   /**
//    * Camera's target DisplayObject
//    */
//   public set stage(stage: DisplayObject | undefined) {
//     if (this._viewport?.children.length === 1) {
//       this._viewport.removeChildAt(0);
//     }
//     if (stage !== undefined) {
//       this._viewport?.addChildAt(stage, 0);
//     }
//   }

//   /**
//    * x of the local position
//    */
//   public override get x(): number {
//     return this._viewport?.pivot.x ?? 0;
//   }

//   /**
//    * x of the local position
//    */
//   public override set x(x: number) {
//     if (this._viewport === undefined) {
//       return;
//     }
//     this._viewport.pivot.x = x;
//   }

//   /**
//    * y of the local position
//    */
//   public override get y(): number {
//     return this._viewport?.pivot.y ?? 0;
//   }

//   /**
//    * y of the local position
//    */
//   public override set y(y: number) {
//     if (this._viewport === undefined) {
//       return;
//     }
//     this._viewport.pivot.y = y;
//   }

//   /**
//    * Scale
//    */
//   public get zoom(): number {
//     return this._viewport?.scale.x ?? 0;
//   }

//   /**
//    * Scale
//    */
//   public set zoom(zoom: number) {
//     if (this._viewport === undefined) {
//       return;
//     }
//     this._viewport.scale.x = zoom;
//     this._viewport.scale.y = zoom;
//   }

//   /**
//    * @param option.maxZoom
//    * Maximum of zoom, by default it's 15.0 (1500%)
//    *
//    * @param option.minZoom
//    * Minimum of zoom, by default it's 0.25 (25%)
//    *
//    * @param option.stage
//    * The Container inside Camera
//    *
//    * @param option.swipeKeyInput
//    * The KeyInput to swipe, by default it's {}
//    *
//    * @param option.zoominKeyInput
//    * The KeyInput to zoom in, by default it's { Equal }
//    *
//    * @param option.zoomoutKeyInput
//    * The KeyInput to zoom out, by default it's { Minus }
//    *
//    * @param option.zoomWheelKeyInput
//    * The KeyInput to zoom with wheel, by default it's { ctrlKey }
//    */
//   constructor(option?: {
//     maxZoom?: number;
//     minZoom?: number;
//     stage?: DisplayObject;
//     swipeKeyInput?: KeyInput;
//     zoominKeyInput?: KeyInput;
//     zoomoutKeyInput?: KeyInput;
//     zoomWheelKeyInput?: KeyInput;
//   }) {
//     super();

//     [this.pointer, this.setPointer] =
//       createOptionalSignal(undefined);

//     [this.dragging, this.setDragging] = createSignal(false);

//     [this.event, this.setEvent] = createOptionalSignal(
//       new EventEmitter()
//     );

//     [this.maxZoom, this.setMaxZoom] = createSignal(
//       option?.maxZoom ?? 15.0
//     );

//     [this.minZoom, this.setMinZoom] = createSignal(
//       option?.minZoom ?? 0.25
//     );

//     [this.swipeKeyInput, this.setSwipeKeyInput] =
//       createOptionalSignal(new KeyInput());

//     [this.zoomInKeyInput, this.setZoomInKeyInput] =
//       createOptionalSignal(new KeyInput({ code: 'Equal' }));

//     [this.zoomOutKeyInput, this.setZoomOutKeyInput] =
//       createOptionalSignal(new KeyInput({ code: 'Minus' }));

//     [this.zoomWheelKeyInput, this.setZoomWheelKeyInput] =
//       createOptionalSignal(new KeyInput({ ctrlKey: true }));

//     this._viewport = new Container();
//     this._zoomWheel = (e) => {
//       if (this.zoomInKeyInput()?.equal(e) === true) {
//         this._zoomOnWindow(+16);
//       } else if (
//         this.zoomOutKeyInput()?.equal(e) === true
//       ) {
//         this._zoomOnWindow(-16);
//       }
//     };

//     this.addChild(this._viewport);
//     this.stage = option?.stage;

//     this.on('added', this.attach).on(
//       'removed',
//       this.detach
//     );
//   }

//   public override destroy(): void {
//     if (this.destroyed === true) {
//       return;
//     }
//     super.destroy();

//     this.setPointer(undefined);

//     this.event()?.removeAllListeners();
//     this.setEvent(undefined);

//     this.setMaxZoom(1);

//     this.setMinZoom(1);

//     this.setSwipeKeyInput(undefined);

//     this.setZoomInKeyInput(undefined);

//     this.setZoomOutKeyInput(undefined);

//     this.setZoomWheelKeyInput(undefined);

//     this._viewport?.destroy();
//     this._viewport = undefined;

//     this._zoomWheel = undefined;

//     this.detach();
//   }

//   public attach() {
//     this.detach();

//     this.interactive = true;
//     this.visible = true;

//     this.on('mousedown', this._onMousedown)
//       .on('mousemove', this._onMousemove)
//       .on('mouseup', this._onMouseup)
//       .on('mouseupoutside', this._onMouseupoutside)
//       .on('wheel', this._onWheel);

//     if (this._zoomWheel !== undefined) {
//       window.addEventListener('keydown', this._zoomWheel);
//     }
//   }

//   public detach() {
//     this.interactive = false;
//     this.visible = false;

//     this.off('mousedown', this._onMousedown)
//       .off('mousemove', this._onMousemove)
//       .off('mouseup', this._onMouseup)
//       .off('mouseupoutside', this._onMouseupoutside)
//       .off('wheel', this._onWheel);

//     if (this._zoomWheel !== undefined) {
//       window.removeEventListener(
//         'keydown',
//         this._zoomWheel
//       );
//     }
//   }

//   public dragOnWindow(pointer: IPointData) {
//     if (this.pointer() === undefined) {
//       return;
//     }

//     const { x: newX, y: newY } = this.toLocal(pointer);
//     const { x: oldX, y: oldY } = this.toLocal(
//       this.pointer()
//     );
//     this._viewport?.position.set(
//       this._viewport.position.x - oldX + newX,
//       this._viewport.position.y - oldY + newY
//     );
//     this.pointer()?.copyFrom(pointer);
//     this.event()?.emit('drag', this);
//   }

//   public moveOnWindow(pointer: IPointData) {
//     this._viewport?.toLocal(
//       pointer,
//       undefined,
//       this._viewport.pivot
//     );
//     this.toLocal(
//       pointer,
//       undefined,
//       this._viewport?.position
//     );
//     this.pointer()?.copyFrom(pointer);
//     this.event()?.emit('move', this);
//   }

//   private _onMousedown(e: FederatedMouseEvent) {
//     if (e.button == 0) {
//       this.setDragging(true);
//     }
//   }

//   private _onMousemove(e: FederatedMouseEvent) {
//     if (this.dragging()) {
//       this.dragOnWindow(e.client);
//     } else {
//       this.moveOnWindow(e.client);
//     }
//   }

//   private _onMouseup() {
//     if (this.dragging()) {
//       this.setDragging(false);
//     }
//   }

//   private _onMouseupoutside(e: FederatedMouseEvent) {
//     if (this.dragging()) {
//       this.dragOnWindow(e.client);
//       this.setDragging(false);
//     }
//   }

//   private _onWheel(e: FederatedWheelEvent) {
//     if (this.zoomWheelKeyInput()?.equal(e)) {
//       this._zoomOnWindow(-e.deltaY);
//     } else if (this.swipeKeyInput()?.equal(e)) {
//       const { x, y } = this.pointer()!;
//       this.dragOnWindow({
//         x: x - e.deltaX,
//         y: y - e.deltaY
//       });
//       this.moveOnWindow({ x, y });
//     }
//   }

//   /**
//    * zoom by approximation
//    */
//   private _zoomOnWindow(delta: number) {
//     if (delta >= 0) {
//       this.zoom = Math.min(
//         this.maxZoom(),
//         this.zoom * (1 + delta / 50)
//       );
//     } else {
//       this.zoom = Math.max(
//         this.minZoom(),
//         this.zoom / (1 + -delta / 50)
//       );
//     }
//     this.event()?.emit('zoom', this);
//   }
// }

// interface _CameraEvents {
//   drag: [pointer: IPointData];
//   move: [pointer: IPointData, x: number, y: number];
//   zoom: [zoom: number];
// }
