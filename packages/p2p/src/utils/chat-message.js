export default class ChatMessage {
    constructor({
        channel_url,
        created_at,
        custom_type,
        file_type,
        id,
        message,
        message_type,
        name,
        sender_user_id,
        status,
        url,
    }) {
        this.channel_url = channel_url;
        this.created_at = created_at;
        this.custom_type = custom_type;
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

    static TYPE_ADMIN = 'admin';
    static TYPE_FILE = 'file';
    static TYPE_USER = 'user';
}

export const convertFromChannelMessage = channel_message => {
    return new ChatMessage({
        channel_url: channel_message.channelUrl,
        created_at: channel_message.createdAt,
        custom_type: channel_message.customType,
        file_type: channel_message.type,
        id: channel_message.messageId,
        message: channel_message.message,
        message_type: channel_message.messageType,
        name: channel_message.name,
        sender_user_id: channel_message.sender.userId,
        url: channel_message.url,
    });
};

export const admin_message =
    "Hello! This is where you can chat with the counterparty to confirm the order details.\nNote: In case of a dispute, we'll use this chat as a reference.";
