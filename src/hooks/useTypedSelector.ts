import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { StoreState } from '../redux';

export const useTypedSelector: TypedUseSelectorHook<StoreState> = useSelector;
