import * as signalR from '@microsoft/signalr';
import { ReviewProductCreationDTO, ReviewProductResponseDTO } from '../models';
import { AppLocalStorage as LocalStorageService } from './tokenConfig';

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
            .withAutomaticReconnect()
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

export enum chatHubRequestConstraints {
    SEND_MESSAGE_TO_ALL = 'sendMessageToAll',
    SEND_MESSAGE_TO_CALLER = 'sendMessageToCaller',
    SEND_MESSAGE_TO_USER = 'sendMessageToUser',
}

export enum chatHubResponseConstraints {
    RECEIVE_MESSAGE = 'broadcastMessage',
}

interface IChatHub extends Hub {
    sendMessageToAll(name: string, message: string): void;
    sendMessageToCaller(name: string, message: string): void;
    senMessageToUser(connectionId: string, message: string): void;
    receiveMessage(callback: (name: string, message: string) => void): void;
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

export enum reviewHubRequestConstraints {
    JOIN_REVIEW_GROUP = 'joinReviewGroup',
    LEAVE_REVIEW_GROUP = 'leaveReviewGroup',
    SEND_REVIEW_TO_MERCHANT = 'sendReviewToMerchant',
}

export enum reviewHubResponseConstraints {
    RECEIVE_REVIEW_FROM_BUYER = 'broadcastReceiveReview',
}
class ReviewHub extends Hub {
    constructor() {
        super('/hubs/review');
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

    override getHubName(): string {
        return 'review';
    }
}

export { ChatHub, ReviewHub };
export const HubState = signalR.HubConnectionState;
