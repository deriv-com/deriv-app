import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { MobileFullPageModal, Modal } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import AddPaymentMethod from '../my-profile/payment-methods/add-payment-method/add-payment-method.jsx';

const CreateAdAddPaymentMethodModal = () => {
    const { my_ads_store } = useStores();

    if (isMobile()) {
        return (
            <MobileFullPageModal
                body_className='buy-sell__modal-body'
                className='buy-sell__modal'
                height_offset='80px'
                is_flex
                is_modal_open={my_ads_store.should_show_add_payment_method_modal}
                page_header_className='buy-sell__modal-header'
                page_header_text={localize('Choose payment method')}
                pageHeaderReturnFn={() => my_ads_store.setShouldShowAddPaymentMethodModal(false)}
            >
                <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className='p2p-my-ads__modal-error'
            has_close_icon
            height='560px'
            is_open={my_ads_store.should_show_add_payment_method_modal}
            title={localize('Choose payment method')}
            toggleModal={() => my_ads_store.setShouldShowAddPaymentMethodModal(false)}
        >
            <Modal.Body>
                <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
            </Modal.Body>
        </Modal>
    );
};

export default observer(CreateAdAddPaymentMethodModal);
