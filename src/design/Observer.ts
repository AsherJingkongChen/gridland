export interface IObserver {
  update: (...args: any[]) => any;
};

export interface ISubject {
  observe(observer: IObserver): ISubject;
  unobserve(observer: IObserver): IObserver | undefined;
  notify(): void;
};

/* A template for implementation */

// class Observer {
//   public update: (o: Observer, s: Subject) => void;
// 
//   constructor(update: (o: Observer, s: Subject) => void) {
//     this.update = update;
//   }
// };
// 
// class Subject {
//   public observers: Set<Observer>;
// 
//   constructor() {
//     this.observers = new Set();
//   }
// 
//   public observe(observer: Observer): Subject {
//     this.observers.add(observer);
//     return this;
//   }
// 
//   public unobserve(observer: Observer): Observer | undefined {
//     if (this.observers.delete(observer)) {
//       return observer;
//     }
//     return undefined;
//   }
// 
//   public notify(): void {
//     for (const o of this.observers) {
//       o.update(o, this);
//     }
//   }
// };
