import * as signalR from '@microsoft/signalr';
import { AppLocalStorage as LocalStorageService } from './tokenConfig';

const host = process.env.REACT_APP_ENVIRONMENT_HOST;
const loginToken: string = LocalStorageService.getLoginUser() as string;

export enum chatHubRequestConstraints {
    SEND_MESSAGE_TO_ALL = 'sendMessageToAll',
    SEND_MESSAGE_TO_CALLER = 'sendMessageToCaller',
    SEND_MESSAGE_TO_USER = 'sendMessageToUser',
}

export enum chatHubResponseConstraints {
    RECEIVE_MESSAGE = 'broadcastMessage',
}

class Hub {
    protected hubConnectionBuilder: signalR.HubConnection;
    constructor(url: string) {
        this.hubConnectionBuilder = new signalR.HubConnectionBuilder()
            .withUrl(`${host}${url}`, {
                accessTokenFactory: () => {
                    return loginToken;
                },
                transport:
                    signalR.HttpTransportType.WebSockets |
                    signalR.HttpTransportType.ServerSentEvents |
                    signalR.HttpTransportType.LongPolling,
            })
            .withAutomaticReconnect()
            .build();
    }
    getHubConnection(): signalR.HubConnection {
        return this.hubConnectionBuilder;
    }
    connect() {
        this.hubConnectionBuilder.start().then(
            (value) => {
                console.log('Connected', value);
            },
            () => {
                console.log('Connection failed');
            }
        );
    }
    disconnect() {
        this.hubConnectionBuilder.onclose((error) => {
            console.log('Disconnected');
        });
    }
}

interface IChatHub extends Hub {
    sendMessageToAll(name: string, message: string): void;
    sendMessageToCaller(name: string, message: string): void;
    senMessageToUser(connectionId: string, message: string): void;
    receiveMessage(callback: (name: string, message: string) => void): void;
}
class ChatHub extends Hub implements IChatHub {
    constructor() {
        super('/chat');
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
}

export const chatHubConnection: IChatHub = new ChatHub();
export const HubState = signalR.HubConnectionState;
