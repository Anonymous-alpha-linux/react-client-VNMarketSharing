import { AuthAction } from './auth';
import { UserAction } from './user';
import { ProductAction } from './product';

export type Action = AuthAction | UserAction | ProductAction;
