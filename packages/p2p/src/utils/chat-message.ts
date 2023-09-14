import { FileMessage, UserMessage } from '@sendbird/chat/message';

type TChatMessageArgs = {
    created_at: number;
    channel_url: string;
    id: string;
    file_type?: string;
    message?: string;
    message_type: string;
    name?: string;
    sender_user_id: string;
    status?: number;
    url?: string;
};

export default class ChatMessage {
    created_at: number;
    channel_url: string;
    id: string;
    file_type?: string;
    message?: string;
    message_type: string;
    name?: string;
    sender_user_id: string;
    status?: number;
    url?: string;

    constructor({
        created_at,
        channel_url,
        id,
        file_type,
        message,
        message_type,
        name,
        sender_user_id,
        status,
        url,
    }: TChatMessageArgs) {
        this.created_at = created_at;
        this.channel_url = channel_url;
        this.file_type = file_type;
        this.id = id;
        this.message = message;
        this.message_type = message_type;
        this.name = name;
        this.sender_user_id = sender_user_id;
        this.status = status;
        this.url = url;
    }

    static STATUS_PENDING = 0;
    static STATUS_ERRORED = 1;

    // Below two statuses are never used but here for consistency.
    // The read receipts are generated based on "chat_channel" receipt timestamps
    // rather than individual message statuses.
    // static STATUS_DELIVERED_TO_SERVER = 2;
    // static STATUS_READ_BY_RECEIVER = 3;

    static TYPE_USER = 'user';
    static TYPE_FILE = 'file';
}

export const convertFromChannelMessage = (channel_message: UserMessage | FileMessage) => {
    return new ChatMessage({
        created_at: channel_message.createdAt,
        channel_url: channel_message.channelUrl,
        file_type: channel_message.isFileMessage() ? channel_message.type : undefined,
        id: channel_message.messageId.toString(),
        message: channel_message.isUserMessage() ? channel_message.message : undefined,
        message_type: channel_message.messageType,
        name: channel_message.isFileMessage() ? channel_message.name : undefined,
        sender_user_id: channel_message.sender.userId,
        url: channel_message.isFileMessage() ? channel_message.url : undefined,
    });
};
