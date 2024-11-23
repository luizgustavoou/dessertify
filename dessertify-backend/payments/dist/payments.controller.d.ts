import { ConsumeMessage } from 'amqplib';
export declare class PaymentsController {
    pubSubHandler(msg: {}, amqpMsg: ConsumeMessage): Promise<void>;
}
