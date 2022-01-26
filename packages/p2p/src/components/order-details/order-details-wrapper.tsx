import React from 'react';
import { Icon, MobileFullPageModal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import PageReturn from 'Components/page-return/page-return.jsx';
import { useStores } from 'Stores';
import OrderDetailsFooter from 'Components/order-details/order-details-footer.jsx';

type OrderDetailsWrapperProps = {
    children: React.ReactNode,
    onPageReturn: () => void,
    page_title: string
};

const OrderDetailsWrapper = (
    {
        children,
        onPageReturn,
        page_title
    }: OrderDetailsWrapperProps
) => {
    const { order_store, sendbird_store } = useStores();

    return isMobile() ? (
        <MobileFullPageModal
            className='order-details'
            height_offset='80px'
            is_flex
            is_modal_open
            pageHeaderReturnFn={onPageReturn}
            page_header_text={page_title}
            renderPageHeaderTrailingIcon={() => (
                <Icon
                    icon='IcChat'
                    height={15}
                    width={16}
                    onClick={() => sendbird_store.setShouldShowChatModal(true)}
                />
            )}
            renderPageFooterChildren={() =>
                order_store.order_information.should_show_order_footer && (
                    <OrderDetailsFooter order_information={order_store.order_information} />
                )
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

export default OrderDetailsWrapper;
