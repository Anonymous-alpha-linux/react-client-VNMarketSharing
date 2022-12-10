import React from 'react';
import { toast } from 'react-toastify';
import { NotificationHub } from '../config';
import { useActions, useTypedSelector } from '../hooks';

export type Hub = {
    notificationHub: NotificationHub
}

export const NotificationHubContext = React.createContext<Hub | null>(null);

export const HubContainer = ({children}: {children: React.ReactNode}) => {
    const [state] = React.useState<Hub>({
        notificationHub: new NotificationHub()
    });
    const {data: {isAuthorized}} = useTypedSelector(p => p.auth);
    const {data: {notifies}} = useTypedSelector(p => p.user);
    const {pushNewNotification} = useActions();

    React.useEffect(() =>{
        if(isAuthorized && !state.notificationHub.hasConnected()){
            state.notificationHub.connect({
                onConnected(hub){
                    hub.receiveNotification((newNotification) => {
                        // toast.success("Welcome back! ", {
                        //     position: toast.POSITION.TOP_RIGHT,
                        //     autoClose: 2000,
                        //     hideProgressBar: true,
                        //     closeOnClick: false,
                        //     pauseOnHover: false,
                        //     draggable: true,
                        //     pauseOnFocusLoss: false,
                        // });
                        pushNewNotification(newNotification);
                    });
                },
                onReconnecting() {
                    console.log("Reconnecting");
                },
                onFailed(error){
                    if(!window.location.href.includes("/auth")){
                        toast.warning(<span>Sign your account to buy your favorite <a href='/auth/login'>Click here</a></span>, {
                            style: {
                                top: '40px'
                            }
                        });
                    }
                },
                onReconnected(hub) {
                    // hub.receiveNotification((newNotification) => {
                    //     pushNewNotification(newNotification);
                    // });
                },
            })
        }
    },[isAuthorized]);
    
    return (
        <NotificationHubContext.Provider value={state}>
            {children}
        </NotificationHubContext.Provider>
    )
}