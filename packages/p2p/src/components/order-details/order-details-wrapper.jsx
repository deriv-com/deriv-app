import React from 'react';
import PropTypes from 'prop-types';
import { Icon, MobileFullPageModal, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import OrderDetailsFooter from 'Components/order-details/order-details-footer.jsx';

const OrderDetailsWrapper = ({ children, page_title }) => {
    const { order_store, sendbird_store } = useStores();
    return isMobile() ? (
        <div data-testid='order-details-wrapper-mobile'>
            <MobileFullPageModal
                className='order-details'
                body_className='order-details--body'
                height_offset='80px'
                is_flex
                is_modal_open
                pageHeaderReturnFn={order_store.onPageReturn}
                page_header_text={page_title}
                renderPageHeaderTrailingIcon={() => (
                    <Icon
                        data_testid='testid'
                        icon='IcChat'
                        height={15}
                        width={16}
                        onClick={() => sendbird_store.setShouldShowChatModal(true)}
                    />
                )}
                renderPageFooterChildren={
                    order_store.order_information.should_show_order_footer
                        ? () => <OrderDetailsFooter order_information={order_store.order_information} />
                        : null
                }
            >
                {children}
            </MobileFullPageModal>
        </div>
    ) : (
        <React.Fragment>
            <PageReturn onClick={order_store.onPageReturn} page_title={page_title} />
            <ThemedScrollbars height='70vh'>{children}</ThemedScrollbars>
        </React.Fragment>
    );
};

OrderDetailsWrapper.propTypes = {
    children: PropTypes.any,
    page_title: PropTypes.string,
};

export default OrderDetailsWrapper;
