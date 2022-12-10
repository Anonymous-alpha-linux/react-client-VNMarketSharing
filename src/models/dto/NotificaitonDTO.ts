export type GetNotificationDTO = {
    id: number;
    title: string;
    shortMessage: string;
    url: string;
    createdAt: Date;
    type: number;
    userId: number
    userName: string;
}

export type GetNotificationTrackerDTO = {
    hasSeen: boolean;
    seenTime: Date | null;
    notifyId: number;
    notification: GetNotificationDTO;
}
