export interface IDeliveryAddressProps {
  street: string;
  number: number;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export interface IRawDeliveryAddress extends IDeliveryAddressProps {}

export class DeliveryAddress {
  private _street: string;
  private _number: number;
  private _city: string;
  private _state: string;
  private _country: string;
  private _zipcode: string;

  constructor(props: IDeliveryAddressProps) {
    this._street = props.street;
    this._number = props.number;
    this._city = props.city;
    this._state = props.state;
    this._country = props.country;
    this._zipcode = props.zipcode;
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

  get state(): string {
    return this._state;
  }

  get country(): string {
    return this._country;
  }

  get zipcode(): string {
    return this._zipcode;
  }

  public raw(): IDeliveryAddressProps {
    return {
      street: this.street,
      number: this.number,
      city: this.city,
      state: this.state,
      country: this.country,
      zipcode: this.zipcode,
    };
  }
}
