import { AuthAction } from './auth';
import { UserAction } from './user';

export type Action = AuthAction | UserAction;
