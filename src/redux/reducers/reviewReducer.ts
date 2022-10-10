import { ReducerState } from '.';
import { ResponseStatus, ReviewProductResponseDTO } from '../../models';
import { ActionTypes } from '../action-types';
import { Action } from '../actions';

type SingleReviewProductStore = {
    productId: number;
    reviewCachedList: ReviewProductResponseDTO[];
    loaded: number;
    amount: number;
    page: number;
    take: number;
};

interface ReviewState {
    reviewList: SingleReviewProductStore[];
}

const initialState: ReducerState<ReviewState> = {
    data: {
        reviewList: [],
    },
    loading: false,
    error: '',
    status: ResponseStatus.NOT_RESPONSE,
};

export const reviewCachedReducer = (
    state: ReducerState<ReviewState> = initialState,
    action: Action
): ReducerState<ReviewState> => {
    const oldReviewList = state.data.reviewList;
    switch (action.type) {
        case ActionTypes.GET_REVIEW_LIST:
            return {
                ...state,
                loading: true,
                error: '',
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.GET_REVIEW_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                error: '',
                status: ResponseStatus.SUCCESS,
                data: {
                    reviewList: oldReviewList.map((review, index) => {
                        if (review.productId === action.payload.productId) {
                            return {
                                ...review,
                                productId: action.payload.productId,
                                loaded:
                                    review.loaded +
                                    action.payload.reviewList.length,
                                reviewCachedList: [
                                    ...review.reviewCachedList,
                                    ...action.payload.reviewList,
                                ],
                                page: review.page + 1,
                                amount: action.payload.reviewAmount,
                            };
                        }
                        return review;
                    }),
                },
            };
        case ActionTypes.GET_REVIEW_LIST_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload,
                status: ResponseStatus.FAILED,
            };

        case ActionTypes.CREATE_NEW_REVIEW:
            return {
                ...state,
                loading: true,
                error: '',
                status: ResponseStatus.NOT_RESPONSE,
            };
        case ActionTypes.CREATE_NEW_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                error: '',
                status: ResponseStatus.SUCCESS,
                data: {
                    reviewList: oldReviewList.map((review, index) => {
                        if (review.productId === action.payload.productId) {
                            return {
                                ...review,
                                productId: action.payload.productId,
                                loaded:
                                    review.loaded + 1,
                                reviewCachedList: [
                                    action.payload.newReview,
                                    ...review.reviewCachedList,
                                ]
                            };
                        }
                        return review;
                    }),
                },
            };
        case ActionTypes.CREATE_NEW_REVIEW_FAILED:
            return state;

        case ActionTypes.UPDATE_REVIEW:
            return state;
        case ActionTypes.UPDATE_REVIEW_SUCCESS:
            return state;
        case ActionTypes.UPDATE_REVIEW_FAILED:
            return state;

        default:
            return state;
    }
};
