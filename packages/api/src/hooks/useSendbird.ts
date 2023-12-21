import React from 'react';
import SendbirdChat from '@sendbird/chat';
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

class Sendbird {
    api: ReturnType<typeof SendbirdChat.init<GroupChannelModule[]>>;

    constructor(app_id: string) {
        this.api = SendbirdChat.init({
            appId: app_id,
            modules: [new GroupChannelModule()],
        });
    }

    async connect(user_id: string, token: string) {
        const user = await this.api.connect(user_id, token);
        if (!user) {
            throw new Error();
        }
    }
}

const useSendbird = (order_id: string) => {
    const sendbirdApiRef = React.useRef<ReturnType<typeof SendbirdChat.init<GroupChannelModule[]>>>();

    const [isChatLoading, setIsChatLoading] = React.useState(false);
    const [isChatError, setIsChatError] = React.useState(false);
    const [chatChannelUrl, setChatChannelUrl] = React.useState('');
    const [messages, setMessages] = React.useState<ChatMessage[] | undefined>();
    const [chatChannel, setChatChannel] = React.useState<GroupChannel | undefined>();

    const { data: sendbirdServiceToken, isSuccess: isSuccessSendbirdServiceToken } = useSendbirdServiceToken();
    const { data: advertiserInfo, isSuccess: isSuccessAdvertiserInfo } = useAdvertiserInfo();
    const { mutate: createChat } = useChatCreate();
    const { data: orderInfo, isSuccess: isOrderInfoSuccess } = useOrderInfo(order_id);
    const { data: serverTime } = useServerTime();

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

                const sendbirdUser = await sendbirdApiRef.current.connect(advertiserInfo.chat_user_id, token);
                if (!sendbirdUser) {
                    setIsChatError(true);
                } else if (sendbirdApiRef?.current && orderInfo?.chat_channel_url) {
                    sendbirdApiRef.current.groupChannel.addGroupChannelHandler(
                        'P2P_SENDBIRD_GROUP_CHANNEL_HANDLER',
                        new GroupChannelHandler()
                    );
                    const chatChannelUrl = orderInfo.chat_channel_url;
                    const channel = await sendbirdApiRef.current.groupChannel.getChannel(chatChannelUrl);
                    if (!channel) {
                        setIsChatError(true);
                    } else {
                        setChatChannel(channel);
                        initialiseMessages();
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

    const initialiseMessages = async (from_timestamp?: number) => {
        if (chatChannel && (from_timestamp || serverTime?.time)) {
            const messagesFormatted: ChatMessage[] = [];
            const timestamp = from_timestamp || serverTime?.time || 0;

            const shouldSortFromMostRecent = messages ? messages?.length > 0 : false;
            const retrievedMessages = await chatChannel.getMessagesByTimestamp(timestamp, {
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
            setMessages(messagesFormatted);
        }
    };

    return {
        messages,
        initialiseChat,
        isChatLoading,
    };
};

export default useSendbird;
