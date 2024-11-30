export class CardDetails {
  constructor(
    public cvc: string,
    public number: string,
    public exp_month?: number,
    public exp_year?: number,
  ) {}
}

export class CreateChargeEvent {
  constructor(
    public card: CardDetails,
    public amount: number,
    public email: string,
    public orderId: string,
  ) {}
}
