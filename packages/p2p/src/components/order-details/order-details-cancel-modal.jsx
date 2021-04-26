import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FormError from 'Components/form/error.jsx';
import 'Components/order-details/order-details-confirm-modal.scss';

const OrderDetailsCancelModal = ({
    cancel_error_message,
    cancels_remaining,
    hideCancelOrderModal,
    order_id,
    should_show_cancel_modal,
}) => {
    const isMounted = useIsMounted();

    const [error_message, setErrorMessage] = React.useState(cancel_error_message);

    const cancelOrderRequest = () => {
        requestWS({
            p2p_order_cancel: 1,
            id: order_id,
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setErrorMessage(response.error.message);
                }

                hideCancelOrderModal();
            }
        });
    };

    return (
        <Modal
            className='cancel-modal'
            is_open={should_show_cancel_modal}
            toggleModal={hideCancelOrderModal}
            has_close_icon
            renderTitle={() => (
                <Text color='prominent' line-height='m' size='s' weight='bold'>
                    <Localize i18n_default_text='Do you want to cancel this order?' />
                </Text>
            )}
            width='440px'
        >
            <Modal.Body>
                {cancels_remaining > 1 ? (
                    <Text color='prominent' size='xs'>
                        <Localize
                            i18n_default_text='If you cancel your order 3 times in 24 hours, you will be blocked from using DP2P for a day. <br /> ({{cancels_remaining}} cancellations remaining.)'
                            values={{ cancels_remaining }}
                        />
                    </Text>
                ) : (
                    <Text color='prominent' size='xs'>
                        <Localize i18n_default_text='If you cancel this order, you’ll be blocked from using DP2P for 24 hours.' />
                    </Text>
                )}
                <Text color='loss-danger' size='xs'>
                    <Localize i18n_default_text='Please do not cancel if you have already made payment.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                {error_message && <FormError message={error_message} />}
                <Button.Group>
                    <Button secondary large onClick={cancelOrderRequest}>
                        <Localize i18n_default_text='Cancel this order' />
                    </Button>
                    <Button primary type='button' onClick={hideCancelOrderModal} large>
                        <Localize i18n_default_text='Do not cancel' />
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

OrderDetailsCancelModal.propTypes = {
    hideCancelOrderModal: PropTypes.func,
    order_id: PropTypes.string,
    should_show_cancel_modal: PropTypes.bool,
};

export default OrderDetailsCancelModal;
