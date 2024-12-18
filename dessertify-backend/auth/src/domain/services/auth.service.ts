import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '@/domain/contracts/repositories/auth.repository';
import {
  CustomerEntity,
  IRawCustomer,
} from '@/domain/entities/customer.entity';
import { HashProvider } from '@/domain/contracts/providers/hash-provider.contract';

// TODO: Refatorarm pois a autenticação não é responsabilidade do domínio, mas sim da aplicação
export interface IRegisterCustomerParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}


export abstract class AuthService {
  abstract registerCustomer(
    params: IRegisterCustomerParams,
  ): Promise<CustomerEntity>;
}

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async registerCustomer(
    params: IRegisterCustomerParams,
  ): Promise<CustomerEntity> {
    const customer = await this.authRepository.findOneCustomerByEmail({
      email: params.email,
    });

    if (customer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const hashPassword = await this.hashProvider.hash({
      content: params.password,
    });

    const newCustomer = CustomerEntity.create({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: hashPassword,
    });

    const customerSaved = await this.authRepository.createCustomer(newCustomer);

    return customerSaved;
  }

}
