export const CHAT_MESSAGE_TYPE = {
    ADMIN: 'admin',
    FILE: 'file',
    USER: 'user',
} as const;

export const CHAT_MESSAGE_STATUS = {
    ERRORED: 1,
    PENDING: 0,
} as const;

export const CHAT_FILE_TYPE = {
    FILE: 'file',
    IMAGE: 'image',
    PDF: 'pdf',
} as const;
