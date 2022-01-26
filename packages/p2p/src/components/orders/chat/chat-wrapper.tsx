import React from 'react';
import { MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import ChatHeader from './chat-header.jsx';

type ChatWrapperProps = {
    children: React.ReactNode,
    is_modal_open: boolean
};

const ChatWrapper = observer(({
    children,
    is_modal_open
}: ChatWrapperProps) => {
    const { sendbird_store, order_store } = useStores();

    return isMobile() ? (
        <MobileFullPageModal
            className='order-chat'
            height_offset='80px'
            is_flex
            is_modal_open={is_modal_open}
            page_header_className='order-chat__header'
            pageHeaderReturnFn={() => {
                sendbird_store.setShouldShowChatModal(false);
                sendbird_store.setShouldShowChatOnOrders(false);
                order_store.hideDetails(true);
            }}
            renderPageHeaderText={() => <ChatHeader.Body />}
        >
            {children}
        </MobileFullPageModal>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );
});

export default ChatWrapper;
