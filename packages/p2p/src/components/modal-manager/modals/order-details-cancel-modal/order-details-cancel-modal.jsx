import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import FormError from 'Components/form/error.jsx';
import { useModalManagerContext } from '../../modal-manager-context';

const OrderDetailsCancelModal = () => {
    const { general_store, order_store } = useStores();
    const { cancels_remaining } = general_store.advertiser_info;
    const { hideModal, is_modal_open } = useModalManagerContext();

    const isMounted = useIsMounted();

    const cancelOrderRequest = () => {
        requestWS({
            p2p_order_cancel: 1,
            id: order_store.order_information.id,
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    order_store.setErrorMessage(response.error.message);
                }

                hideModal();
            }
        });
    };

    return (
        <Modal
            className='cancel-modal'
            has_close_icon={false}
            is_open={is_modal_open}
            toggleModal={hideModal}
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
                            i18n_default_text='If you cancel your order {{cancellation_limit}} times in {{cancellation_period}} hours, you will be blocked from using Deriv P2P for {{block_duration}} hours. <br /> ({{number_of_cancels_remaining}} cancellations remaining)'
                            values={{
                                block_duration: order_store.cancellation_block_duration,
                                cancellation_limit: order_store.cancellation_limit,
                                cancellation_period: order_store.cancellation_count_period,
                                number_of_cancels_remaining: cancels_remaining,
                            }}
                        />
                    </Text>
                ) : (
                    <Text color='prominent' size='xs'>
                        <Localize
                            i18n_default_text="If you cancel this order, you'll be blocked from using Deriv P2P for {{block_duration}} hours."
                            values={{
                                block_duration: order_store.cancellation_block_duration,
                            }}
                        />
                    </Text>
                )}
                <div className='cancel-modal__warning'>
                    <Text color='loss-danger' size='xs'>
                        <Localize i18n_default_text='Please do not cancel if you have already made payment.' />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer className='cancel-modal__footer'>
                {order_store.error_message && <FormError message={order_store.error_message} />}
                <Button.Group>
                    <Button secondary large onClick={cancelOrderRequest}>
                        <Localize i18n_default_text='Cancel this order' />
                    </Button>
                    <Button primary type='button' onClick={hideModal} large>
                        <Localize i18n_default_text='Do not cancel' />
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsCancelModal;
