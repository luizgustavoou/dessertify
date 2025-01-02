const isEntity = (v: Entity): v is Entity => {
  return v instanceof Entity;
};

export abstract class Entity {
  protected readonly _id: string;

  constructor(id: string) {
    this._id = id;
  }

  public equals(object?: Entity): boolean {
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
