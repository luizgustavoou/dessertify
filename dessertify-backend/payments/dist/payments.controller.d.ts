import { ConsumeMessage } from 'amqplib';
export declare class PaymentsController {
    customerCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage): Promise<void>;
}
