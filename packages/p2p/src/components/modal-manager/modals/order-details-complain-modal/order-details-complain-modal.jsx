import React from 'react';
import { Button, MobileFullPageModal, Modal, Text } from '@deriv/components';
import { isMobile, useIsMounted } from '@deriv/shared';
import { localize, Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import FormError from 'Components/form/error.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context.js';
import OrderDetailsComplainModalRadioGroup from './order-details-complain-modal-radio-group.jsx';

const ComplainExplanation = () => (
    <div className='order-details-complain-modal__explanation'>
        <Text size='xxs' line_height='m' color='general'>
            <Localize i18n_default_text="If your complaint isn't listed here, please contact our Customer Support team." />
        </Text>
    </div>
);

const ComplainFooter = ({ dispute_reason, disputeOrderRequest, error_message, hideComplainOrderModal }) => (
    <React.Fragment>
        {error_message && <FormError message={error_message} />}
        <Button.Group>
            <Button secondary type='button' onClick={hideComplainOrderModal} large>
                <Localize i18n_default_text='Cancel' />
            </Button>
            <Button is_disabled={!dispute_reason} primary large onClick={disputeOrderRequest}>
                <Localize i18n_default_text='Submit' />
            </Button>
        </Button.Group>
    </React.Fragment>
);

const OrderDetailsComplainModal = () => {
    const isMounted = useIsMounted();
    const [dispute_reason, setDisputeReason] = React.useState('');
    const [error_message, setErrorMessage] = React.useState('');
    const { order_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    const id = order_store.order_information.id;
    const { is_buy_order_for_user } = order_store.order_information;

    const disputeOrderRequest = () => {
        requestWS({
            p2p_order_dispute: 1,
            id,
            dispute_reason,
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setErrorMessage(response.error.message);
                }
                hideModal();
            }
        });
    };

    const onCheckboxChange = reason => setDisputeReason(reason);

    if (isMobile()) {
        return (
            <MobileFullPageModal
                body_className='order-details-complain-modal__body'
                className='order-details-complain-modal'
                height_offset='80px'
                is_flex
                is_modal_open={is_modal_open}
                page_header_className='order-details-complain-modal__header'
                page_header_text={localize('Complaint')}
                pageHeaderReturnFn={hideModal}
                renderPageFooterChildren={() => (
                    <ComplainFooter
                        dispute_reason={dispute_reason}
                        disputeOrderRequest={disputeOrderRequest}
                        error_message={error_message}
                        hideComplainOrderModal={hideModal}
                    />
                )}
                page_footer_className='order-details-complain-modal__footer'
            >
                <OrderDetailsComplainModalRadioGroup
                    is_buy_order_for_user={is_buy_order_for_user}
                    dispute_reason={dispute_reason}
                    onCheckboxChange={onCheckboxChange}
                />
                <ComplainExplanation />
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className='order-details-complain-modal'
            is_open={is_modal_open}
            toggleModal={hideModal}
            has_close_icon
            renderTitle={() => (
                <Text color='prominent' line-height='m' size='s' weight='bold'>
                    <Localize i18n_default_text="What's your complaint?" />
                </Text>
            )}
            width='440px'
            height='500px'
        >
            <Modal.Body className='order-details-complain-modal__body'>
                <OrderDetailsComplainModalRadioGroup
                    is_buy_order_for_user={is_buy_order_for_user}
                    dispute_reason={dispute_reason}
                    onCheckboxChange={onCheckboxChange}
                />
                <ComplainExplanation />
            </Modal.Body>
            <Modal.Footer>
                <div className='order-details-complain-modal__footer'>
                    <ComplainFooter
                        dispute_reason={dispute_reason}
                        disputeOrderRequest={disputeOrderRequest}
                        error_message={error_message}
                        hideComplainOrderModal={hideModal}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsComplainModal;
