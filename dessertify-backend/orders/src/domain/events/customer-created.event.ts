export class CustomerCreatedEvent {
  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
  ) {}
}
