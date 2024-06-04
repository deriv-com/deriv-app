import React, { Fragment, SyntheticEvent, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { CHAT_FILE_TYPE, CHAT_MESSAGE_TYPE } from '@/constants';
import { useSendbird } from '@/hooks';
import { convertToMB, formatMilliseconds } from '@/utils';
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
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatMessages.length > 0 && scrollRef.current) {
            // Scroll all the way to the bottom of the container.
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages.length]);

    const getMessageFormat = (chatMessage: TChatMessages[number], messageColor: string) => {
        const { fileType = '', name, size = 0, url } = chatMessage ?? {};
        switch (fileType) {
            case CHAT_FILE_TYPE.IMAGE:
                return (
                    <a
                        className='p2p-v2-chat-messages__item__image'
                        href={url}
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <img alt={name} onLoad={onImageLoad} src={url} />
                    </a>
                );
            case CHAT_FILE_TYPE.PDF:
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

            default:
                return (
                    <ChatMessageText color={messageColor}>
                        <a
                            className='p2p-v2-chat-messages__item__file'
                            href={url}
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            {name}
                        </a>
                    </ChatMessageText>
                );
        }
    };

    const onImageLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        // Height of element changes after the image is loaded. Accommodate
        // this extra height in the scroll.
        if (scrollRef.current) {
            scrollRef.current.scrollTop += event.currentTarget.parentElement
                ? event.currentTarget.parentElement.clientHeight
                : 0;
        }
    };

    return (
        <div className='p2p-v2-chat-messages' ref={scrollRef}>
            <AdminMessage />
            {chatMessages.map(chatMessage => {
                const isMyMessage = chatMessage.senderUserId === userId;
                const messageDate = formatMilliseconds(chatMessage.createdAt, 'MMMM D, YYYY');
                const messageColor = isMyMessage ? 'white' : 'general';
                const shouldRenderDate = currentDate !== messageDate && !!(currentDate = messageDate);
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
