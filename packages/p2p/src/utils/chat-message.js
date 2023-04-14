export default class ChatMessage {
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
        size,
    }) {
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
        this.size = size;
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

export const convertFromChannelMessage = channel_message => {
    return new ChatMessage({
        created_at: channel_message.createdAt,
        channel_url: channel_message.channelUrl,
        file_type: channel_message.type,
        id: channel_message.messageId,
        message: channel_message.message,
        message_type: channel_message.messageType,
        name: channel_message.name,
        sender_user_id: channel_message.sender.userId,
        url: channel_message.url,
        size: channel_message.size,
    });
};
