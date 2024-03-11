import React from 'react';
import clsx from 'clsx';
import { CHAT_MESSAGE_TYPE } from '@/constants';
import { useSendbird } from '@/hooks';
import { convertToMB, formatMilliseconds, isImageType, isPDFType } from '@/utils';
import { Text } from '@deriv-com/ui';
import { AdminMessage } from '../AdminMessage';
import { ChatMessageReceipt } from '../ChatMessageReceipt';
import { ChatMessageText } from '../ChatMessageText';
import './ChatMessages.scss';

type TChatMessages = NonNullable<ReturnType<typeof useSendbird>['messages']>;
type TChatMessagesProps = {
    chatChannel: ReturnType<typeof useSendbird>['activeChatChannel'];
    chatMessages: TChatMessages;
    userId?: string;
};
const ChatMessages = ({ chatChannel, chatMessages = [], userId }: TChatMessagesProps) => {
    let currentDate = null;
    const getMessageFormat = (chatMessage: TChatMessages[number], messageColor: string) => {
        const { fileType = '', name, size, url } = chatMessage ?? {};
        if (isImageType(fileType))
            return (
                <a className='p2p-v2-chat-messages__item__image' href={url} rel='noopener noreferrer' target='_blank'>
                    <img src={url} />
                </a>
            );
        else if (isPDFType(fileType)) {
            return (
                <ChatMessageText color={messageColor}>
                    <div className='p2p-v2-chat-messages__item__pdf'>
                        {/* <Icon icon='IcPdf' data_testid='dt_pdf_icon' size={20} /> */}
                        <a href={url} rel='noopener noreferrer' target='_blank'>
                            {name}
                        </a>
                    </div>
                    {`${convertToMB(size).toFixed(2)}MB`}
                </ChatMessageText>
            );
        }
        return (
            <ChatMessageText color={messageColor}>
                <a className='p2p-v2-chat-messages__item__file' href={url} rel='noopener noreferrer' target='_blank'>
                    {name}
                </a>
            </ChatMessageText>
        );
    };

    return (
        <div>
            <div className='p2p-v2-chat-messages__item p2p-v2-chat-messages__item__admin'>
                <ChatMessageText color='general' type='admin'>
                    Hello! This is where you can chat with the counterparty to confirm the order details.
                    <br />
                    Note: In case of a dispute, we’ll use this chat as a reference.
                </ChatMessageText>
            </div>
            {chatMessages.map(chatMessage => {
                const isMyMessage = chatMessage.senderUserId === userId;
                const messageDate = formatMilliseconds(chatMessage.createdAt, 'MMMM D, YYYY');
                const messageColor = isMyMessage ? 'colored-background' : 'general';
                const shouldRenderDate = currentDate !== messageDate && Boolean((currentDate = messageDate));

                return (
                    <React.Fragment key={chatMessage.id}>
                        {shouldRenderDate && (
                            <div className='p2p-v2-chat-messages__date'>
                                <Text align='center' color='less-prominent' size='xs' weight='bold'>
                                    {messageDate}
                                </Text>
                            </div>
                        )}
                        <div
                            className={clsx(
                                'p2p-v2-chat-messages__item',
                                `p2p-v2-chat-messages__item__${isMyMessage ? 'outgoing' : 'incoming'}`
                            )}
                        >
                            {chatMessage.messageType === CHAT_MESSAGE_TYPE.USER && (
                                <ChatMessageText color={messageColor} type={chatMessage.customType}>
                                    {chatMessage.message}
                                </ChatMessageText>
                            )}
                            {chatMessage.messageType === CHAT_MESSAGE_TYPE.FILE &&
                                getMessageFormat(chatMessage, messageColor)}
                            <div className='p2p-v2-chat-messages__item__timestamp'>
                                <Text color='less-prominent' size='2xs'>
                                    {formatMilliseconds(chatMessage.createdAt, 'HH:mm', true)}
                                </Text>
                                {/* {isMyMessage && (
                                    <ChatMessageReceipt
                                        chatChannel={chatChannel}
                                        message={chatMessage}
                                        userId={userId}
                                    />
                                )} */}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ChatMessages;
