import React, { useEffect, useState } from 'react'
import {ToastContainer, Toast as BootstrapToast} from 'react-bootstrap';

enum ToastStateType{
    SUCCESS="success",
    WARNING="warning"
}
interface ToastValues {
    [field: string]: any
}
interface ToastState{
    message: string;
    status: ToastStateType
}
type ToastContextProps = {
    toast_list: ToastState[] | undefined;
    addToast: (toast: ToastState) => void;
}

const ToastContext = React.createContext<ToastContextProps | null>(null);

export default function Toast({children}:{children?: React.ReactNode}) {
    const [toastList, setNewToastList] = useState<ToastState[]>([]);
    const [timeout, setTime] = useState(3000);

    const contextValue: ToastContextProps = {
        toast_list: toastList,
        addToast: (toast) => {
            setNewToastList(oldToast => [
                ...oldToast, 
                toast
            ])
        }
    }

    return (
        <ToastContext.Provider value={contextValue}>
            <ToastContext.Consumer>
                {value => <ToastContainer>
                    {!!value?.toast_list && value?.toast_list.map((toast, index) =>{
                        return <BootstrapToast key={index + 1}>
                            <BootstrapToast.Header></BootstrapToast.Header>
                            <BootstrapToast.Body>{toast.message}</BootstrapToast.Body>
                        </BootstrapToast>
                    })}
                </ToastContainer>}
            </ToastContext.Consumer>
        </ToastContext.Provider>
    )
}

export function useToastContext() {
    return React.useContext(ToastContext);
}