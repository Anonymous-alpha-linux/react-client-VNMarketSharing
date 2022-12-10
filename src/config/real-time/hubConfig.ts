import * as signalR from '@microsoft/signalr';
import { GetNotificationDTO, GetNotificationTrackerDTO, ReviewProductCreationDTO, ReviewProductResponseDTO } from '../../models';
import { AppLocalStorage as LocalStorageService } from '../LocalStorageConfig';
import { chatHubRequestConstraints, chatHubResponseConstraints, notificationHubRequestConstraints, reviewHubRequestConstraints, reviewHubResponseConstraints} from './constraints';
const host = process.env.REACT_APP_ENVIRONMENT_HOST;
// class MyLogger implements signalR.ILogger {
//     log(logLevel: signalR.LogLevel, message: string) {
//         if (logLevel === signalR.LogLevel.Error) {
//             console.error(logLevel.toString(), message);
//         }
//         if (logLevel === signalR.LogLevel.Warning) {
//             console.warn(logLevel.toString(), message);

//     }
// }

interface HubOptionsCallback<T> {
    onConnected?: (hub: T) => void;
    onFailed?: (error: string) => void;
    onReconnecting?: () => void;
    onReconnected?: (hub: T) => void;
    onClose?: (hub: T) => void;
}

abstract class Hub {
    protected hubConnectionBuilder: signalR.HubConnection;
    loginToken: string;

    constructor(url: string) {
        this.loginToken = LocalStorageService.getLoginUser() as string;
        this.hubConnectionBuilder = new signalR.HubConnectionBuilder()
            .withUrl(`${host}${url.startsWith('/') ? url : `/${url}`}`, {
                accessTokenFactory: () => {
                    return `${this.loginToken}`;
                },
                transport:
                    signalR.HttpTransportType.WebSockets |
                    signalR.HttpTransportType.ServerSentEvents |
                    signalR.HttpTransportType.LongPolling,
                withCredentials: true,
            })
            .configureLogging(signalR.LogLevel.Debug)
            .withAutomaticReconnect([0, 100])
            .build();
    }

    getHubConnection(): signalR.HubConnection {
        return this.hubConnectionBuilder;
    }
    connect(options?: HubOptionsCallback<this>) {
        this.hubConnectionBuilder
            .start()
            .then((value) => {
                // console.log(`Connected to ${this.getHubName()} hub`);
                !!options && options?.onConnected && options.onConnected(this);
            })
            .catch((error) => {
                // console.log(`Connection failed in ${this.getHubName()} hub`);
                !!options && options?.onFailed && options?.onFailed(error);
            });

        this.hubConnectionBuilder.onreconnecting((error) => {
            // console.log(error || `Connecting within ${this.getHubName()}`);
            !!options && options?.onReconnecting && options?.onReconnecting();
        });

        this.hubConnectionBuilder.onreconnected((connectionId) => {
            !!connectionId &&
                !!options &&
                options?.onReconnected &&
                options?.onReconnected(this);
        });

        this.hubConnectionBuilder.onclose((error) => {
            !!options && options?.onClose && options?.onClose(this);
        });
    }
    disconnect() {
        this.hubConnectionBuilder.stop().then((value) => {
            // console.log(`Disconnected from ${this.getHubName()} hub`);
        });
    }
    getHubState(): signalR.HubConnectionState {
        return this.hubConnectionBuilder.state;
    }
    hasConnected(): boolean {
        return (
            this.hubConnectionBuilder.state ===
            signalR.HubConnectionState.Connected
        );
    }
    abstract getHubName(): string;
}

class ChatHub extends Hub {
    constructor() {
        super('/hubs/chat');
    }

    sendMessageToAll(name: string, message: string) {
        this.hubConnectionBuilder.send(
            chatHubRequestConstraints.SEND_MESSAGE_TO_ALL,
            name,
            message
        );
    }
    sendMessageToCaller(name: string, message: string) {
        this.hubConnectionBuilder.send(
            chatHubRequestConstraints.SEND_MESSAGE_TO_CALLER,
            name,
            message
        );
    }
    senMessageToUser(connectionId: string, message: string) {
        this.hubConnectionBuilder.send(
            chatHubRequestConstraints.SEND_MESSAGE_TO_USER,
            connectionId,
            message
        );
    }
    receiveMessage(callback: (name: string, message: string) => void) {
        this.hubConnectionBuilder.on(
            chatHubResponseConstraints.RECEIVE_MESSAGE,
            (name: string, message: string) => {
                callback(name, message);
            }
        );
    }
    override getHubName(): string {
        return 'chat';
    }
}

class ReviewHub extends Hub {
    constructor() {
        super('/hubs/review');
    }

    override getHubName(): string {
        return 'review';
    }

    // Mean: join to see new review of product as real-time
    joinReviewGroup(productId: number) {
        return this.hubConnectionBuilder.send(
            reviewHubRequestConstraints.JOIN_REVIEW_GROUP,
            productId
        );
    }

    leaveReviewGroup(productId: number) {
        return this.hubConnectionBuilder.send(
            reviewHubRequestConstraints.LEAVE_REVIEW_GROUP,
            productId
        );
    }

    sendReviewToMerchant(
        request: ReviewProductCreationDTO,
        merchantId: number
    ): Promise<void> {
        return this.hubConnectionBuilder.send(
            reviewHubRequestConstraints.SEND_REVIEW_TO_MERCHANT,
            request
            // merchantId
        );
    }

    receiveReviewFromBuyer(
        callback: (newReview: ReviewProductResponseDTO | null) => void
    ): ReviewProductResponseDTO | null {
        let result = null;
        this.hubConnectionBuilder.on(
            reviewHubResponseConstraints.RECEIVE_REVIEW_FROM_BUYER,
            (response: ReviewProductResponseDTO | null) => {
                callback(response);
            }
        );
        return result;
    }
}

class NotificationHub extends Hub{
    constructor() {
        super('/hubs/notify');
    }

    override getHubName(): string {
        return 'notify';
    }

    testNotification(callback?: () =>void){
        callback?.();
        return this.hubConnectionBuilder.send("TestNotify");
    }

    joinNotificationGroup(callback?: () => void){
        callback?.();
        return this.hubConnectionBuilder.send(notificationHubRequestConstraints.JOIN_NOTIFICATION_GROUP);
    }

    receiveNotification(callback: (newEntry: GetNotificationTrackerDTO) => void){
        return this.hubConnectionBuilder.on(notificationHubRequestConstraints.RECEIVE_NOTIFICATION, callback);
    }

    notifyNewProduct(): Promise<void>{
        return this.hubConnectionBuilder.send("notifyNewProduct", "/admin/product");
    }
}

export { ChatHub, ReviewHub, NotificationHub };
export const HubState = signalR.HubConnectionState;
