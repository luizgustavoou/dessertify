export class CustomerCreatedEvent {
  constructor(
    public authCustomerId: string,
    public email: string,
    public firstName: string,
    public lastName: string,
  ) {}
}
