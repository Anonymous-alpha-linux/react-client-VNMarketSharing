import { AuthAction } from './auth';
import { UserAction } from './user';
import { ProductAction } from './product';
import { SellerAction } from './seller';
import { CartAction } from './cart';
import { CategoryAction } from './category';

export type Action =
    | AuthAction
    | UserAction
    | ProductAction
    | SellerAction
    | CartAction
    | CategoryAction;
