import React from 'react';
import SendbirdChat, { User } from '@sendbird/chat';
import useSendbirdServiceToken from './useSendbirdServiceToken';
import { GroupChannel, GroupChannelHandler, GroupChannelModule } from '@sendbird/chat/groupChannel';
import useAdvertiserInfo from './p2p/useAdvertiserInfo';
import useChatCreate from './p2p/useChatCreate';
import { BaseMessage, MessageTypeFilter } from '@sendbird/chat/message';
import useOrderInfo from './p2p/useOrderInfo';
import useServerTime from './useServerTime';

type ChatMessage = {
    created_at: number;
    channel_url: string;
    custom_type?: string;
    id: string;
    file_type?: 'image' | 'pdf' | 'file';
    message?: string;
    message_type: string;
    name?: string;
    sender_user_id: string;
    size?: number;
    status?: number;
    url?: string;
};

const useSendbird = (order_id: string) => {
    const sendbirdApiRef = React.useRef<ReturnType<typeof SendbirdChat.init<GroupChannelModule[]>>>();

    const [isChatLoading, setIsChatLoading] = React.useState(false);
    const [isChatError, setIsChatError] = React.useState(false);
    const [messages, setMessages] = React.useState<ChatMessage[] | undefined>();
    const [chatChannel, setChatChannel] = React.useState<GroupChannel | undefined>();

    const { data: sendbirdServiceToken, isSuccess: isSuccessSendbirdServiceToken } = useSendbirdServiceToken();
    const { data: advertiserInfo, isSuccess: isSuccessAdvertiserInfo } = useAdvertiserInfo();
    const { mutate: createChat } = useChatCreate();
    const { data: orderInfo } = useOrderInfo(order_id);
    const { data: serverTime } = useServerTime();

    const getUser = async (user_id: string, token: string) => {
        if (sendbirdApiRef?.current) {
            const user = await sendbirdApiRef.current.connect(user_id, token);
            return user;
        }
    };

    const getChannel = React.useCallback(async (channel_url: string) => {
        if (sendbirdApiRef?.current) {
            sendbirdApiRef.current.groupChannel.addGroupChannelHandler(
                'P2P_SENDBIRD_GROUP_CHANNEL_HANDLER',
                new GroupChannelHandler()
            );
            const channel = await sendbirdApiRef.current.groupChannel.getChannel(channel_url);
            return channel;
        }
    }, []);

    const getMessages = React.useCallback(
        async (channel: GroupChannel, from_timestamp: number) => {
            const messagesFormatted: ChatMessage[] = [];
            const timestamp = from_timestamp || serverTime?.time || 0;

            const shouldSortFromMostRecent = messages ? messages?.length > 0 : false;
            const retrievedMessages = await channel.getMessagesByTimestamp(timestamp, {
                isInclusive: false,
                prevResultSize: 50,
                nextResultSize: 0,
                reverse: shouldSortFromMostRecent,
                messageTypeFilter: MessageTypeFilter.ALL,
                customTypesFilter: [''],
            });

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

            retrievedMessages.forEach(message => {
                if (message.isUserMessage() || message.isFileMessage()) {
                    messagesFormatted.push({
                        created_at: message.createdAt,
                        channel_url: message.channelUrl,
                        custom_type: message.customType,
                        file_type: getMessageType(message),
                        id: message.messageId.toString(),
                        message: message.isUserMessage() ? message.message : undefined,
                        message_type: message.messageType,
                        name: message.isFileMessage() ? message.name : undefined,
                        sender_user_id: message.sender.userId,
                        size: message.isFileMessage() ? message.size : undefined,
                        url: message.isFileMessage() ? message.url : undefined,
                    });
                }
            });
            return messagesFormatted;
        },
        [messages, serverTime?.time]
    );

    const initialiseChat = React.useCallback(async () => {
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
                    // if there is no chat_channel_url, it needs to be created using useCreateChat hook first
                    // 2. Retrieve the P2P channel for the specific order
                    const channel = await getChannel(orderInfo.chat_channel_url);
                    if (!channel) {
                        setIsChatError(true);
                    } else {
                        setChatChannel(channel);
                        // 3. Retrieve any existing messages in the channel
                        const retrievedMessages = await getMessages(channel, serverTime?.time || 0);
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
        getChannel,
        getMessages,
        serverTime?.time,
    ]);

    React.useEffect(() => {
        if (!orderInfo?.chat_channel_url) {
            createChat({
                order_id,
            });
        } else {
            initialiseChat();
        }
    }, [order_id, orderInfo?.chat_channel_url, createChat, initialiseChat]);

    return {
        messages,
        initialiseChat,
        getChannel,
        getMessages,
        getUser,
        isChatError,
        isChatLoading,
    };
};

export default useSendbird;
