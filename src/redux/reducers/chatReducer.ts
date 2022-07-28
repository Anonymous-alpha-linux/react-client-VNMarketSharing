import { ActionTypes, Action } from '..';
import { ResponseStatus } from '../../models';

interface ChatState {
    data: {
        message: string;
        sessionId: string;
    };
    loading: boolean;
    error: string;
    status?: ResponseStatus;
}

const initialState: ChatState = {
    data: {
        message: '',
        sessionId: '',
    },
    loading: false,
    error: '',
    status: ResponseStatus.NOT_RESPONSE,
};

const authReducer = (
    state: ChatState = initialState,
    action: Action
): ChatState => {
    switch (action.type) {
        case ActionTypes.CHANGE_PASSWORD:
            return state;
        default:
            return state;
    }
};

export default authReducer;
