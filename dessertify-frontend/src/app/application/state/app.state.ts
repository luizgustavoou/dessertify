import { IAuthState } from '@/application/state/auth.state';
import { ICartState } from '@/application/state/cart.state';

export interface AppState {
  cart: ICartState;
  auth: IAuthState;
}
