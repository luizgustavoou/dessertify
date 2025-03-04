export interface IDeliveryAddressProps {
  zipcode: string;
  city: string;
  street: string;
  number: number;
  neighborhood: string;
  complement: string;
  reference: string;
}

export interface IRawDeliveryAddress extends IDeliveryAddressProps {}

export class DeliveryAddress {
  private _zipcode: string;
  private _city: string;
  private _street: string;
  private _number: number;
  private _neighborhood: string;
  private _complement: string;
  private _reference: string;

  constructor(props: IDeliveryAddressProps) {
    this._zipcode = props.zipcode;
    this._city = props.city;
    this._street = props.street;
    this._number = props.number;
    this._neighborhood = props.neighborhood;
    this._complement = props.complement;
    this._reference = props.reference;
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get city(): string {
    return this._city;
  }

  get zipcode(): string {
    return this._zipcode;
  }

  get neighborhood(): string {
    return this._neighborhood;
  }

  get complement(): string {
    return this._complement;
  }

  get reference(): string {
    return this._reference;
  }

  public raw(): IDeliveryAddressProps {
    return {
      street: this.street,
      number: this.number,
      city: this.city,
      zipcode: this.zipcode,
      neighborhood: this.neighborhood,
      complement: this.complement,
      reference: this.reference,
    };
  }
}
