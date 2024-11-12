import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { CommonModule } from '@app/common';
import { AuthController } from '@app/auth/auth.controller';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
