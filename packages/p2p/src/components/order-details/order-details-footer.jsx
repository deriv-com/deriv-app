import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';
import OrderDetailsCancelModal from './order-details-cancel-modal.jsx';
import OrderDetailsComplainModal from './order-details-complain-modal.jsx';
import OrderDetailsConfirmModal from './order-details-confirm-modal.jsx';

const OrderDetailsFooter = observer(() => {
    const isMounted = useIsMounted();
    const { order_store } = useStores();
    const {
        is_buy_order,
        is_my_ad,
        is_sell_order,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_only_received_button,
        should_show_only_complain_button,
    } = order_store.order_information;

    const is_buy_order_for_user = (is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad);

    const [cancel_error_message, setErrorMessage] = React.useState('');
    const [cancels_remaining, setCancelsRemaining] = React.useState(null);
    const [should_show_cancel_modal, setShouldShowCancelModal] = React.useState(false);
    const [should_show_complain_modal, setShouldShowComplainModal] = React.useState(false);
    const [should_show_confirm_modal, setShouldShowConfirmModal] = React.useState(false);

    const hideCancelOrderModal = () => setShouldShowCancelModal(false);
    const showCancelOrderModal = () => {
        requestWS({ p2p_advertiser_info: 1 }).then(response => {
            if (isMounted()) {
                if (!response.error) {
                    setCancelsRemaining(response.p2p_advertiser_info.cancels_remaining);
                    setShouldShowCancelModal(true);
                } else {
                    setErrorMessage(response.error.message);
                    setShouldShowCancelModal(true);
                }
            }
        });
    };

    const hideComplainOrderModal = () => setShouldShowComplainModal(false);
    const showComplainOrderModal = () => setShouldShowComplainModal(true);

    const hideConfirmOrderModal = () => setShouldShowConfirmModal(false);
    const showConfirmOrderModal = () => setShouldShowConfirmModal(true);

    if (should_show_cancel_and_paid_button) {
        return (
            <React.Fragment>
                <div className='order-details-card__footer'>
                    <div className='order-details-card__footer--right'>
                        <Button.Group>
                            <Button large secondary onClick={showCancelOrderModal}>
                                <Localize i18n_default_text='Cancel order' />
                            </Button>
                            <Button large primary onClick={showConfirmOrderModal}>
                                <Localize i18n_default_text="I've paid" />
                            </Button>
                        </Button.Group>
                    </div>
                </div>
                <OrderDetailsCancelModal
                    cancels_remaining={cancels_remaining}
                    cancel_error_message={cancel_error_message}
                    hideCancelOrderModal={hideCancelOrderModal}
                    order_id={order_store.order_information.id}
                    should_show_cancel_modal={should_show_cancel_modal}
                />
                <OrderDetailsConfirmModal
                    hideConfirmOrderModal={hideConfirmOrderModal}
                    is_buy_order_for_user={is_buy_order_for_user}
                    order_information={order_store.order_information}
                    should_show_confirm_modal={should_show_confirm_modal}
                />
            </React.Fragment>
        );
    }

    if (should_show_complain_and_received_button) {
        return (
            <React.Fragment>
                <div className='order-details-card__footer'>
                    <div className='order-details-card__footer--left'>
                        <Button large tertiary onClick={showComplainOrderModal}>
                            <Localize i18n_default_text='Complain' />
                        </Button>
                    </div>
                    <div className='order-details-card__footer--right'>
                        <Button large primary onClick={showConfirmOrderModal}>
                            <Localize i18n_default_text="I've received payment" />
                        </Button>
                    </div>
                </div>
                <OrderDetailsComplainModal
                    id={order_store.order_information.id}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideComplainOrderModal={hideComplainOrderModal}
                    should_show_complain_modal={should_show_complain_modal}
                />
                <OrderDetailsConfirmModal
                    order_information={order_store.order_information}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideConfirmOrderModal={hideConfirmOrderModal}
                    should_show_confirm_modal={should_show_confirm_modal}
                />
            </React.Fragment>
        );
    }

    if (should_show_only_complain_button) {
        return (
            <React.Fragment>
                <div className='order-details-card__footer'>
                    <div className='order-details-card__footer--left'>
                        <Button large tertiary onClick={showComplainOrderModal}>
                            <Localize i18n_default_text='Complain' />
                        </Button>
                    </div>
                </div>
                <OrderDetailsComplainModal
                    id={order_store.order_information.id}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideComplainOrderModal={hideComplainOrderModal}
                    should_show_complain_modal={should_show_complain_modal}
                />
            </React.Fragment>
        );
    }

    if (should_show_only_received_button) {
        return (
            <React.Fragment>
                <div className='order-details-card__footer'>
                    <div className='order-details-card__footer--right'>
                        <Button large primary onClick={showConfirmOrderModal}>
                            <Localize i18n_default_text="I've received payment" />
                        </Button>
                    </div>
                </div>
                <OrderDetailsConfirmModal
                    order_information={order_store.order_information}
                    is_buy_order_for_user={is_buy_order_for_user}
                    hideConfirmOrderModal={hideConfirmOrderModal}
                    should_show_confirm_modal={should_show_confirm_modal}
                />
            </React.Fragment>
        );
    }

    return null;
});

OrderDetailsFooter.propTypes = {
    order_information: PropTypes.object,
};

export default OrderDetailsFooter;
