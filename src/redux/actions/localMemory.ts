import { ActionTypes } from '../action-types';

export type LocalMemoryAction = IUpdateLocalStorage;

interface IUpdateLocalStorage {
    type: ActionTypes.UPDATE_LOCAL_STORAGE;
    payload: any;
}
