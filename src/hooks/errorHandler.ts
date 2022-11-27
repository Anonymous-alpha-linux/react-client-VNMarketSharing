import { AxiosError } from 'axios';

export function axiosErrorHandler(
    axiosHandler: () => any,
    completeHandler?: (errorMsg: string) => void | null,
    customErrorHandler?: (axiosError: Error | AxiosError | any) => void
) {
    try {
        axiosHandler();
    } catch (axiosError: Error | AxiosError | any) {
        console.log(axiosError);
        if (customErrorHandler) {
            customErrorHandler(axiosError);
        } else {
            let errorMsg = 'Failed';
            if (axiosError instanceof AxiosError) {
                errorMsg = axiosError.response?.data || errorMsg;
            }
            completeHandler && completeHandler(errorMsg);
        }
    }
}
