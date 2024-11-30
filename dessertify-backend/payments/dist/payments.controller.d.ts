import { ConsumeMessage } from 'amqplib';
import { CreateChargeDto } from '@/presentation/dtos/create-charge.dto';
export declare class PaymentsController {
    customerCreatedEventHandler(msg: {}, amqpMsg: ConsumeMessage): Promise<void>;
    orderCreatedEventHandler(msg: CreateChargeDto): Promise<void>;
}
