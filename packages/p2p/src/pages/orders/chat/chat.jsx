import React from 'react';
import PropTypes from 'prop-types';
import { Button, Loading, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import ChatHeader from 'Pages/orders/chat/chat-header.jsx';
import ChatMessages from 'Pages/orders/chat/chat-messages.jsx';
import ChatFooter from 'Pages/orders/chat/chat-footer.jsx';
import ChatWrapper from 'Pages/orders/chat/chat-wrapper.jsx';
import { useStores } from 'Stores';
import 'Pages/orders/chat/chat.scss';

const Chat = observer(() => {
    const { order_store, sendbird_store } = useStores();

    React.useLayoutEffect(() => {
        return () => {
            order_store.onPageReturn();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (sendbird_store.is_chat_loading) {
        return (
            <div className='chat'>
                <Loading is_fullscreen={false} />;
            </div>
        );
    }

    if (sendbird_store.has_chat_error) {
        return (
            <div className='chat'>
                <div className='chat__error'>
                    <Text as='p' color='prominent'>
                        <Localize i18n_default_text='Oops, something went wrong' />
                    </Text>
                    <div className='chat__error-retry'>
                        <Button
                            has_effect
                            large
                            onClick={() => {
                                (async () => {
                                    await sendbird_store.initialiseChatWsConnection();
                                })();
                            }}
                            primary
                            text={localize('Retry')}
                            type='button'
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ChatWrapper is_modal_open={sendbird_store.should_show_chat_modal}>
            <div className='chat'>
                <ChatHeader />
                <ChatMessages />
                <ChatFooter />
            </div>
        </ChatWrapper>
    );
});

Chat.displayName = 'Chat';
Chat.propTypes = {
    has_chat_error: PropTypes.bool,
    is_chat_loading: PropTypes.bool,
    initialiseChatWsConnection: PropTypes.func,
    should_show_chat_modal: PropTypes.bool,
};

export default Chat;
