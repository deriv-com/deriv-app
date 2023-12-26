import React from 'react';
import SendbirdChat, { BaseChannel, User } from '@sendbird/chat';
import { useSendbirdServiceToken, useAdvertiserInfo, useChatCreate, useOrderInfo, useServerTime } from '@deriv/api';
import { GroupChannel, GroupChannelHandler, GroupChannelModule } from '@sendbird/chat/groupChannel';
import { BaseMessage, MessageType, MessageTypeFilter, UserMessage } from '@sendbird/chat/message';

const ChatMessageStatus = {
    PENDING: 'PENDING',
    ERRORED: 'ERRORED',
} as const;

type ChatMessage = {
    channel_url: string;
    created_at: number;
    custom_type?: string;
    file_type?: 'file' | 'image' | 'pdf';
    id: string;
    message?: string;
    message_type: string;
    name?: string;
    sender_user_id: string;
    size?: number;
    status?: keyof typeof ChatMessageStatus;
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
        created_at: sendbirdMessage.createdAt,
        channel_url: sendbirdMessage.channelUrl,
        custom_type: sendbirdMessage.customType,
        file_type: getMessageType(sendbirdMessage),
        id: sendbirdMessage.messageId.toString(),
        message: sendbirdMessage.isUserMessage() ? sendbirdMessage.message : undefined,
        message_type: sendbirdMessage.messageType,
        name: sendbirdMessage.isFileMessage() ? sendbirdMessage.name : undefined,
        sender_user_id: (sendbirdMessage as UserMessage)?.sender.userId,
        size: sendbirdMessage.isFileMessage() ? sendbirdMessage.size : undefined,
        url: sendbirdMessage.isFileMessage() ? sendbirdMessage.url : undefined,
    };
}

const useSendbird = (order_id: string) => {
    const sendbirdApiRef = useRef<ReturnType<typeof SendbirdChat.init<GroupChannelModule[]>>>();

    const [isChatLoading, setIsChatLoading] = useState(false);
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
    const { data: advertiserInfo, isSuccess: isSuccessAdvertiserInfo } = useAdvertiserInfo();
    const { isError: isErrorChatCreate, mutate: createChat } = useChatCreate();
    const { data: orderInfo, isError: isErrorOrderInfo } = useOrderInfo(order_id);
    const { data: serverTime, isError: isErrorServerTime } = useServerTime();

    const getUser = async (user_id: string, token: string) => {
        if (sendbirdApiRef?.current) {
            const user = await sendbirdApiRef.current.connect(user_id, token);
            return user;
        }
    };

    const onMessageReceived = useCallback(() => {
        if (
            receivedMessage?.channelUrl === chatChannel?.url &&
            (receivedMessage?.isUserMessage() || receivedMessage?.isFileMessage())
        ) {
            setMessages([...messages, createChatMessage(receivedMessage)]);
        }

        // NOTE: Do not add messages as dependency, this will cause the function to be recreated over and over again
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatChannel?.url, receivedMessage]);

    useEffect(() => {
        onMessageReceived();
    }, [receivedMessage]);

    const getChannel = async (channel_url: string) => {
        if (sendbirdApiRef?.current) {
            sendbirdApiRef.current.groupChannel.addGroupChannelHandler(
                'P2P_SENDBIRD_GROUP_CHANNEL_HANDLER',
                new GroupChannelHandler({
                    onMessageReceived: (messageReceivedChannel: BaseChannel, _receivedMessage: BaseMessage) =>
                        setReceivedMessage(_receivedMessage),
                })
            );
            const channel = await sendbirdApiRef.current.groupChannel.getChannel(channel_url);
            return channel;
        }
    };

    const getMessages = async (channel: GroupChannel, from_timestamp?: number) => {
        const messagesFormatted: ChatMessage[] = [];
        const timestamp = from_timestamp || serverTime?.server_time_utc || 0;

        const shouldSortFromMostRecent = messages ? messages?.length > 0 : false;
        const retrievedMessages = await channel.getMessagesByTimestamp(timestamp, {
            isInclusive: false,
            prevResultSize: 50,
            nextResultSize: 0,
            reverse: shouldSortFromMostRecent,
            messageTypeFilter: MessageTypeFilter.ALL,
            customTypesFilter: [''],
        });

        retrievedMessages.forEach(message => {
            if (message.isUserMessage() || message.isFileMessage()) {
                messagesFormatted.push(createChatMessage(message));
            }
        });
        return messagesFormatted;
    };

    const sendMessage = (message: string) => {
        if (message.trim().length === 0) return;

        const messageToSendId = `${Date.now()}${message.substring(0, 9)}${messages.length}`;
        const messageToSend: ChatMessage = {
            created_at: serverTime?.server_time_utc || Date.now(),
            channel_url: chatChannel?.url ?? '',
            message,
            id: messageToSendId,
            message_type: MessageType.USER,
            sender_user_id: user?.userId || '',
            status: ChatMessageStatus.PENDING,
        };

        setMessages([...messages, messageToSend]);
        chatChannel
            ?.sendUserMessage({
                message: message.trim(),
                data: messageToSendId,
            })
            .onSucceeded(sentMessage => {
                const idx = messages?.findIndex(msg => msg.id === messageToSendId);
                if (sentMessage.isUserMessage()) {
                    setMessages(previousMessages => previousMessages.toSpliced(idx, 1, createChatMessage(sentMessage)));
                }
            })
            .onFailed(() => {
                const idx = messages?.findIndex(msg => msg.id === messageToSendId);
                const errored_message = {
                    ...messageToSend,
                    status: ChatMessageStatus.ERRORED,
                };
                setMessages(previousMessages => previousMessages.toSpliced(idx, 1, errored_message));
            });
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
                const { app_id, token } = sendbirdServiceToken;

                sendbirdApiRef.current = SendbirdChat.init({
                    appId: app_id,
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
    ]);

    useEffect(() => {
        // close the Sendbird WS connection on unmount
        return () => closeChat();
    }, []);

    useEffect(() => {
        // if the user has not created a chat URL for the order yet, create one using p2p_create_chat endpoint
        if (!orderInfo?.chat_channel_url) {
            createChat({
                order_id,
            });
        } else {
            initialiseChat();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id, orderInfo?.chat_channel_url]);

    return {
        messages,
        refreshChat: initialiseChat,
        sendMessage,
        isError:
            isChatError || isErrorChatCreate || isErrorOrderInfo || isErrorServerTime || isErrorSendbirdServiceToken,
        isChatLoading,
    };
};

export default useSendbird;
