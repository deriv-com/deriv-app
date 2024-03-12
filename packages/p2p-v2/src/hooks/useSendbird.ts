import { useCallback, useEffect, useRef, useState } from 'react';
import { p2p, useChatCreate, useOrderInfo, useSendbirdServiceToken, useServerTime } from '@deriv/api-v2';
import SendbirdChat, { BaseChannel, User } from '@sendbird/chat';
import { GroupChannel, GroupChannelHandler, GroupChannelModule } from '@sendbird/chat/groupChannel';
import { BaseMessage, MessageType, MessageTypeFilter } from '@sendbird/chat/message';

/**
 * The function renames the files by removing any non ISO-8859-1 code point from filename and returns a new blob object with the updated file name.
 * @returns {Blob}
 */
export const renameFile = (file: File) => {
    const newFile = new Blob([file], { type: file.type });
    newFile.name = file.name
        .split('')
        .filter(char => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126)
        .join('');
    return newFile;
};

const ChatMessageStatus = {
    ERRORED: 1,
    PENDING: 0,
} as const;

type ChatMessage = {
    channelUrl: string;
    createdAt: number;
    customType?: string;
    fileType?: 'file' | 'image' | 'pdf';
    id: string;
    message?: string;
    messageType: string;
    name?: string;
    senderUserId?: string;
    size?: number;
    status?: number;
    url?: string;
};

const getMessageType = (message: BaseMessage) => {
    const isImageType = (type: string) => ['image/jpeg', 'image/png', 'image/gif'].includes(type);
    const isPDFType = (type: string) => type === 'application/pdf';

    if (message.isFileMessage()) {
        if (isImageType(message.type)) {
            return 'image';
        } else if (isPDFType(message.type)) {
            return 'pdf';
        }
        return 'file';
    }
};

function createChatMessage(sendbirdMessage: BaseMessage): ChatMessage {
    return {
        channelUrl: sendbirdMessage.channelUrl,
        createdAt: sendbirdMessage.createdAt,
        customType: sendbirdMessage.customType,
        fileType: getMessageType(sendbirdMessage),
        id: sendbirdMessage.messageId.toString(),
        message: sendbirdMessage.isUserMessage() ? sendbirdMessage.message : undefined,
        messageType: sendbirdMessage.messageType,
        name: sendbirdMessage.isFileMessage() ? sendbirdMessage.name : undefined,
        senderUserId:
            sendbirdMessage.isUserMessage() || sendbirdMessage.isFileMessage()
                ? sendbirdMessage.sender?.userId
                : undefined,
        size: sendbirdMessage.isFileMessage() ? sendbirdMessage.size : undefined,
        url: sendbirdMessage.isFileMessage() ? sendbirdMessage.url : undefined,
    };
}

const useSendbird = (orderId: string) => {
    const sendbirdApiRef = useRef<ReturnType<typeof SendbirdChat.init<GroupChannelModule[]>>>();

    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [isChatError, setIsChatError] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatChannel, setChatChannel] = useState<GroupChannel | null>(null);
    const [receivedMessage, setReceivedMessage] = useState<BaseMessage | null>(null);

    const {
        data: sendbirdServiceToken,
        isError: isErrorSendbirdServiceToken,
        isSuccess: isSuccessSendbirdServiceToken,
    } = useSendbirdServiceToken();
    const { data: advertiserInfo, isSuccess: isSuccessAdvertiserInfo } = p2p.advertiser.useGetInfo();
    //TODO: p2p_chat_create endpoint to be removed once chat_channel_url is created from p2p_order_create
    const { isError: isErrorChatCreate, mutate: createChat } = useChatCreate();
    const { data: orderInfo, isError: isErrorOrderInfo } = useOrderInfo(orderId);
    const { data: serverTime, isError: isErrorServerTime } = useServerTime();

    const getUser = async (userId: string, token: string) => {
        if (sendbirdApiRef?.current) {
            const user = await sendbirdApiRef.current.connect(userId, token);
            return user;
        }
    };

    const onMessageReceived = useCallback(() => {
        if (
            receivedMessage?.channelUrl === chatChannel?.url &&
            (receivedMessage?.isUserMessage() || receivedMessage?.isFileMessage())
        ) {
            setMessages(previousMessages => [...previousMessages, createChatMessage(receivedMessage)]);
        }
    }, [chatChannel?.url, receivedMessage]);

    useEffect(() => {
        onMessageReceived();
    }, [receivedMessage, onMessageReceived]);

    const getChannel = async (channelUrl: string) => {
        if (sendbirdApiRef?.current) {
            sendbirdApiRef.current.groupChannel.addGroupChannelHandler(
                'P2P_SENDBIRD_GROUP_CHANNEL_HANDLER',
                new GroupChannelHandler({
                    onMessageReceived: (messageReceivedChannel: BaseChannel, _receivedMessage: BaseMessage) =>
                        setReceivedMessage(_receivedMessage),
                })
            );
            const channel = await sendbirdApiRef.current.groupChannel.getChannel(channelUrl);
            return channel;
        }
    };

    const getMessages = useCallback(
        async (channel: GroupChannel, fromTimestamp?: number) => {
            const messagesFormatted: ChatMessage[] = [];
            const timestamp = fromTimestamp || serverTime?.server_time_utc || 0;

            const shouldSortFromMostRecent = messages ? messages?.length > 0 : false;
            const retrievedMessages = await channel.getMessagesByTimestamp(timestamp, {
                customTypesFilter: [''],
                isInclusive: false,
                messageTypeFilter: MessageTypeFilter.ALL,
                nextResultSize: 0,
                prevResultSize: 50,
                reverse: shouldSortFromMostRecent,
            });

            retrievedMessages.forEach(message => {
                if (message.isUserMessage() || message.isFileMessage()) {
                    messagesFormatted.push(createChatMessage(message));
                }
            });
            return messagesFormatted;
        },
        [messages, serverTime?.server_time_utc]
    );

    const sendMessage = (message: string) => {
        if (message.trim().length === 0) return;

        const messageToSendId = `${Date.now()}${message.substring(0, 9)}${messages.length}`;
        const messageToSend: ChatMessage = {
            channelUrl: chatChannel?.url ?? '',
            createdAt: serverTime?.server_time_utc || Date.now(),
            id: messageToSendId,
            message,
            messageType: MessageType.USER,
            senderUserId: user?.userId || '',
            status: ChatMessageStatus.PENDING,
        };

        setMessages(previousMessages => [...previousMessages, messageToSend]);
        chatChannel
            ?.sendUserMessage({
                data: messageToSendId,
                message: message.trim(),
            })
            .onSucceeded(sentMessage => {
                const idx = messages?.findIndex(msg => msg.id === messageToSendId);
                if (sentMessage.isUserMessage()) {
                    setMessages(previousMessages => previousMessages.toSpliced(idx, 1, createChatMessage(sentMessage)));
                }
            })
            .onFailed(() => {
                const idx = messages?.findIndex(msg => msg.id === messageToSendId);
                const errorMessage = {
                    ...messageToSend,
                    status: ChatMessageStatus.ERRORED,
                };
                setMessages(previousMessages => previousMessages.toSpliced(idx, 1, errorMessage));
            });
    };

    const sendFile = (file: File) => {
        const renamedFile = renameFile(file);

        if (chatChannel) {
            chatChannel
                .sendFileMessage({
                    file: renamedFile,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                })
                .onPending(() => {
                    setIsFileUploading(true);
                })
                .onSucceeded(sentMessage => {
                    if (sentMessage.channelUrl === chatChannel.url && sentMessage.isFileMessage()) {
                        setMessages(previousMessages => [...previousMessages, createChatMessage(sentMessage)]);
                    }
                    setIsFileUploading(false);
                })
                .onFailed(() => {
                    setIsChatError(true);
                    setIsFileUploading(false);
                });
        }
    };

    const closeChat = () => {
        sendbirdApiRef?.current?.disconnect();
    };

    const initialiseChat = useCallback(async () => {
        try {
            if (
                isSuccessSendbirdServiceToken &&
                isSuccessAdvertiserInfo &&
                sendbirdServiceToken?.app_id &&
                advertiserInfo?.chat_user_id
            ) {
                setIsChatError(false);
                setIsChatLoading(true);
                const { app_id: appId, token } = sendbirdServiceToken;

                sendbirdApiRef.current = SendbirdChat.init({
                    appId,
                    modules: [new GroupChannelModule()],
                });

                // 1. Check if the user exists
                const user = await getUser(advertiserInfo.chat_user_id, token || '');
                if (!user) {
                    setIsChatError(true);
                } else if (orderInfo?.chat_channel_url) {
                    setUser(user);
                    // if there is no chat_channel_url, it needs to be created using useCreateChat hook first
                    // 2. Retrieve the P2P channel for the specific order
                    const channel = await getChannel(orderInfo.chat_channel_url);
                    if (!channel) {
                        setIsChatError(true);
                    } else {
                        setChatChannel(channel);
                        // 3. Retrieve any existing messages in the channel
                        const retrievedMessages = await getMessages(channel);
                        setMessages(retrievedMessages);
                    }
                }
            }
        } catch (err) {
            setIsChatError(true);
        } finally {
            setIsChatLoading(false);
        }
    }, [
        isSuccessSendbirdServiceToken,
        isSuccessAdvertiserInfo,
        sendbirdServiceToken,
        advertiserInfo?.chat_user_id,
        orderInfo?.chat_channel_url,
        getMessages,
    ]);

    useEffect(() => {
        // close the Sendbird WS connection on unmount
        return () => closeChat();
    }, []);

    useEffect(() => {
        // if the user has not created a chat URL for the order yet, create one using p2p_create_chat endpoint
        if (!orderInfo?.chat_channel_url) {
            createChat({
                order_id: orderId,
            });
        } else {
            initialiseChat();
        }
    }, [orderId, orderInfo?.chat_channel_url]);

    return {
        activeChatChannel: chatChannel,
        isChatLoading,
        isError:
            isChatError || isErrorChatCreate || isErrorOrderInfo || isErrorServerTime || isErrorSendbirdServiceToken,
        isFileUploading,
        messages,
        refreshChat: initialiseChat,
        sendFile,
        sendMessage,
        userId: user?.userId,
    };
};

export default useSendbird;
