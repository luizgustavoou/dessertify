export abstract class EventBase<T> {
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }
}
