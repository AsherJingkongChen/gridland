export interface IObserver {
  update: (observer: any, subject: any) => void;
};

export interface ISubject {
  observers: Set<IObserver>;
  addOne(observer: IObserver): IObserver;
  removeOne(observer: IObserver): IObserver | undefined;
  notifyAll(): void;
};

/* A template for implementation: */

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
//   public addOne(observer: Observer): Observer {
//     this.observers.add(observer);
//     return observer;
//   }
// 
//   public removeOne(observer: Observer): Observer | undefined {
//     if (this.observers.delete(observer)) {
//       return observer;
//     }
//     return undefined;
//   }
// 
//   public notifyAll(): void {
//     this.observers.forEach((o) => { o.update(o, this); });
//   }
// };
