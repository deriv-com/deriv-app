import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { useIsMounted } from '@deriv/shared';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import SectionError from 'Components/section-error';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';

const OrderDetailsCancelModal = () => {
    const { general_store, order_store } = useStores();
    const { p2p_settings } = useP2PSettings();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { cancels_remaining } = general_store.advertiser_info;
    const { error_message, order_information, setErrorMessage } = order_store ?? {};

    const isMounted = useIsMounted();

    const cancelOrderRequest = () => {
        requestWS({
            p2p_order_cancel: 1,
            id: order_information?.id ?? '',
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setErrorMessage(response.error.message);
                }

                hideModal();
            }
        });
    };

    return (
        <Modal
            className='order-details-cancel-modal'
            has_close_icon={false}
            is_open={is_modal_open}
            toggleModal={hideModal}
            renderTitle={() => (
                <Text color='prominent' weight='bold'>
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
                                block_duration: p2p_settings?.cancellation_block_duration,
                                cancellation_limit: p2p_settings?.cancellation_limit,
                                cancellation_period: p2p_settings?.cancellation_count_period,
                                number_of_cancels_remaining: cancels_remaining,
                            }}
                        />
                    </Text>
                ) : (
                    <Text color='prominent' size='xs'>
                        <Localize
                            i18n_default_text="If you cancel this order, you'll be blocked from using Deriv P2P for {{block_duration}} hours."
                            values={{
                                block_duration: p2p_settings?.cancellation_block_duration,
                            }}
                        />
                    </Text>
                )}
                <div className='order-details-cancel-modal__warning'>
                    <Text color='loss-danger' size='xs'>
                        <Localize i18n_default_text='Please do not cancel if you have already made payment.' />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer className='order-details-cancel-modal__footer'>
                {error_message && <SectionError message={error_message} />}
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
