import { ConfigService } from '@nestjs/config';
export declare class AppModule {
    private readonly configService;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    setup(): Promise<void>;
}
