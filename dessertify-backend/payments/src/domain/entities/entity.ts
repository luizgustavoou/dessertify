import { v4 as uuidv4 } from 'uuid';

const isEntity = <T>(v: Entity<T>): v is Entity<T> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;

  constructor(props: T, id?: string) {
    this._id = id ? id : uuidv4();
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id == object._id;
  }
}
