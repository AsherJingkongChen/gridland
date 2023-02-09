export abstract class ASubject {
  public observers: Set<IObserver>;

  constructor() {
    this.observers = new Set();
  }

  public add(observer: IObserver): IObserver {
    this.observers.add(observer);
    return observer;
  }

  public remove(observer: IObserver): IObserver | undefined {
    if (this.observers.delete(observer)) {
      return observer;
    }
    return undefined;
  }

  public notifyAll(): void {
    this.observers.forEach((o) => { o.update(this); });
  }
};

export interface IObserver {
  update(_: ASubject): void;
};
