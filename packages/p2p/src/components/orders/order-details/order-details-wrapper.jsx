import React from 'react';
import PropTypes from 'prop-types';
import { Icon, MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';

const OrderDetailsWrapper = ({ children, onPageReturn, page_title }) => {
    const { sendbird_store } = useStores();

    return isMobile() ? (
        <MobileFullPageModal
            className='order-details'
            height_offset='80px'
            is_flex
            is_modal_open
            pageHeaderReturnFn={onPageReturn}
            page_header_text={page_title}
            page_header_trailing_icon={
                <Icon
                    icon='IcChat'
                    height={15}
                    width={16}
                    onClick={() => sendbird_store.setShouldShowChatModal(true)}
                />
            }
        >
            {children}
        </MobileFullPageModal>
    ) : (
        <React.Fragment>
            <PageReturn onClick={onPageReturn} page_title={page_title} />
            {children}
        </React.Fragment>
    );
};

OrderDetailsWrapper.propTypes = {
    children: PropTypes.any,
    onPageReturn: PropTypes.func,
    page_title: PropTypes.string,
};

export default OrderDetailsWrapper;
