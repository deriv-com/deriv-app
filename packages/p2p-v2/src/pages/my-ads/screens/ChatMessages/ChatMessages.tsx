import React, { Fragment } from 'react';
import clsx from 'clsx';
import { CHAT_MESSAGE_TYPE } from '@/constants';
import { useSendbird } from '@/hooks';
import { convertToMB, formatMilliseconds, isImageType, isPDFType } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import PDFIcon from '../../../../public/ic-pdf.svg';
import { ChatMessageReceipt } from '../ChatMessageReceipt';
import { ChatMessageText } from '../ChatMessageText';
import './ChatMessages.scss';

type TChatMessages = NonNullable<ReturnType<typeof useSendbird>['messages']>;
type TChatMessagesProps = {
    chatChannel: ReturnType<typeof useSendbird>['activeChatChannel'];
    chatMessages: TChatMessages;
    userId?: string;
};

const AdminMessage = () => (
    <div className='p2p-v2-chat-messages__item p2p-v2-chat-messages__item__admin'>
        <ChatMessageText color='general' type='admin'>
            Hello! This is where you can chat with the counterparty to confirm the order details.
            <br />
            Note: In case of a dispute, we’ll use this chat as a reference.
        </ChatMessageText>
    </div>
);

const ChatMessages = ({ chatChannel, chatMessages = [], userId }: TChatMessagesProps) => {
    const { isMobile } = useDevice();
    let currentDate = '';
    const getMessageFormat = (chatMessage: TChatMessages[number], messageColor: string) => {
        const { fileType = '', name, size = 0, url } = chatMessage ?? {};
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
                        <PDFIcon />
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
        <div className='p2p-v2-chat-messages'>
            <AdminMessage />
            {chatMessages.map(chatMessage => {
                const isMyMessage = chatMessage.senderUserId === userId;
                const messageDate = formatMilliseconds(chatMessage.createdAt, 'MMMM D, YYYY');
                const messageColor = isMyMessage ? 'white' : 'general';
                const shouldRenderDate = currentDate !== messageDate && Boolean((currentDate = messageDate));
                const { customType, message, messageType } = chatMessage;

                return (
                    <Fragment key={chatMessage.id}>
                        {shouldRenderDate && (
                            <div className='p2p-v2-chat-messages__date'>
                                <Text align='center' color='less-prominent' size={isMobile ? 'md' : 'sm'} weight='bold'>
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
                            {messageType === CHAT_MESSAGE_TYPE.USER && (
                                <ChatMessageText color={messageColor} type={customType}>
                                    {message}
                                </ChatMessageText>
                            )}
                            {messageType === CHAT_MESSAGE_TYPE.FILE && getMessageFormat(chatMessage, messageColor)}
                            <div className='p2p-v2-chat-messages__item__timestamp'>
                                <Text color='less-prominent' size={isMobile ? 'xs' : '2xs'}>
                                    {formatMilliseconds(chatMessage.createdAt, 'HH:mm', true)}
                                </Text>
                                {isMyMessage && (
                                    <ChatMessageReceipt
                                        chatChannel={chatChannel}
                                        message={chatMessage}
                                        userId={userId}
                                    />
                                )}
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
};

export default ChatMessages;
