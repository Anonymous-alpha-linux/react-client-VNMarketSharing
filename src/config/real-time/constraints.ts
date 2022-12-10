export enum chatHubRequestConstraints {
    SEND_MESSAGE_TO_ALL = 'sendMessageToAll',
    SEND_MESSAGE_TO_CALLER = 'sendMessageToCaller',
    SEND_MESSAGE_TO_USER = 'sendMessageToUser',
}

export enum chatHubResponseConstraints {
    RECEIVE_MESSAGE = 'broadcastMessage',
}

export enum reviewHubRequestConstraints {
    JOIN_REVIEW_GROUP = 'joinReviewGroup',
    LEAVE_REVIEW_GROUP = 'leaveReviewGroup',
    SEND_REVIEW_TO_MERCHANT = 'sendReviewToMerchant',
}

export enum reviewHubResponseConstraints {
    RECEIVE_REVIEW_FROM_BUYER = 'broadcastReceiveReview',
}

export enum notificationHubRequestConstraints {
    JOIN_NOTIFICATION_GROUP = 'joinNotificationGroup',
    LEAVE_NOTIFICATION_GROUP = 'leaveNotificationGroup',
    RECEIVE_NOTIFICATION = 'broadcastReceiveNotify',
}