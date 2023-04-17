import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text, ThemedScrollbars, Icon } from '@deriv/components';
import { formatMilliseconds } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import ChatMessageReceipt from 'Components/orders/chat/chat-message-receipt.jsx';
import ChatMessageText from 'Components/orders/chat/chat-message-text.jsx';
import { useStores } from 'Stores';
import ChatMessage from 'Utils/chat-message';
import { convertToMB, isImageType, isPDFType } from 'Utils/file-uploader';

const ChatMessages = observer(() => {
    const { sendbird_store } = useStores();
    const scroll_ref = React.useRef(null);

    const onImageLoad = event => {
        // Height of element changes after the image is loaded. Accommodate
        // this extra height in the scroll.
        if (scroll_ref.current) {
            scroll_ref.current.scrollTop += event.target.parentNode.clientHeight;
        }
    };

    React.useEffect(() => {
        if (sendbird_store.chat_messages.length > 0 && scroll_ref.current) {
            // Scroll all the way to the bottom of the container.
            scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight;
        }
    }, [sendbird_store.chat_messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

    sendbird_store.setMessagesRef(scroll_ref);

    if (sendbird_store.chat_messages.length) {
        let current_date = null;

        const getMessageFormat = (chat_message, message_color) => {
            if (isImageType(chat_message.file_type))
                return (
                    <a
                        className='order-chat__messages-item-image'
                        href={chat_message.url}
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <img src={chat_message.url} onLoad={onImageLoad} />
                    </a>
                );
            else if (isPDFType(chat_message.file_type)) {
                return (
                    <ChatMessageText color={message_color}>
                        <div className='order-chat__messages-item-pdf'>
                            <Icon icon='IcPdf' data_testid='dt_pdf_icon' size={20} />
                            <a href={chat_message.url} rel='noopener noreferrer' target='_blank'>
                                {chat_message.name}
                            </a>
                        </div>
                        {`${convertToMB(chat_message.size).toFixed(2)}MB`}
                    </ChatMessageText>
                );
            }
            return (
                <ChatMessageText color={message_color}>
                    <a
                        className='order-chat__messages-item-file'
                        href={chat_message.url}
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        {chat_message.name}
                    </a>
                </ChatMessageText>
            );
        };

        return (
            <ThemedScrollbars
                autohide
                className='order-chat__messages'
                height='unset'
                refSetter={scroll_ref}
                onScroll={event => sendbird_store.onMessagesScroll(event)}
            >
                {sendbird_store.chat_messages.map(chat_message => {
                    const is_my_message = chat_message.sender_user_id === sendbird_store.chat_info.user_id;
                    const message_date = formatMilliseconds(chat_message.created_at, 'MMMM D, YYYY');
                    const message_color = is_my_message ? 'colored-background' : 'general';
                    const should_render_date = current_date !== message_date && Boolean((current_date = message_date));

                    return (
                        <React.Fragment key={chat_message.id}>
                            {should_render_date && (
                                <div className='order-chat__messages-date'>
                                    <Text align='center' color='less-prominent' lh='m' size='xs' weight='bold'>
                                        {message_date}
                                    </Text>
                                </div>
                            )}
                            <div
                                className={classNames(
                                    'order-chat__messages-item',
                                    `order-chat__messages-item--${is_my_message ? 'outgoing' : 'incoming'}`
                                )}
                            >
                                {chat_message.message_type === ChatMessage.TYPE_USER && (
                                    <ChatMessageText color={message_color}>{chat_message.message}</ChatMessageText>
                                )}
                                {chat_message.message_type === ChatMessage.TYPE_FILE &&
                                    getMessageFormat(chat_message, message_color)}
                                <div className={`order-chat__messages-item-timestamp`}>
                                    <Text color='less-prominent' line_height='s' size='xxxs'>
                                        {formatMilliseconds(chat_message.created_at, 'HH:mm', true)}
                                    </Text>
                                    {is_my_message && (
                                        <ChatMessageReceipt
                                            message={chat_message}
                                            chat_channel={sendbird_store.active_chat_channel}
                                            sendbird_user_id={sendbird_store.chat_info.user_id}
                                        />
                                    )}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </ThemedScrollbars>
        );
    }

    return <div className='order-chat__messages' />;
});

ChatMessages.displayName = 'ChatMessages';
ChatMessages.propTypes = {
    active_chat_channel: PropTypes.object,
    chat_messages: PropTypes.number,
    chat_info: PropTypes.shape({
        app_id: PropTypes.string,
        user_id: PropTypes.string,
        token: PropTypes.string,
    }),
};

export default ChatMessages;
