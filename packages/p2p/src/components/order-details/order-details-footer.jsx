import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import OrderDetailsCancelModal from './order-details-cancel-modal.jsx';
import OrderDetailsComplainModal from './order-details-complain-modal.jsx';
import OrderDetailsConfirmModal from './order-details-confirm-modal.jsx';

const OrderDetailsFooter = observer(() => {
    const { order_store } = useStores();
    const {
        // id,
        is_buy_order_for_user,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_only_received_button,
        should_show_only_complain_button,
    } = order_store.order_information;

    const [should_show_cancel_modal, setShouldShowCancelModal] = React.useState(false);
    const [should_show_complain_modal, setShouldShowComplainModal] = React.useState(false);
    const [should_show_confirm_modal, setShouldShowConfirmModal] = React.useState(false);

    React.useEffect(() => {
        const website_status = setInterval(() => {
            order_store.getWebsiteStatus();
        }, 10000);

        return () => {
            clearInterval(website_status);
        };
    });

    const hideCancelOrderModal = () => setShouldShowCancelModal(false);
    const showCancelOrderModal = () => {
        order_store.getAdvertiserInfo(setShouldShowCancelModal);
    };

    const hideComplainOrderModal = () => setShouldShowComplainModal(false);
    const showComplainOrderModal = () => setShouldShowComplainModal(true);

    const hideConfirmOrderModal = () => setShouldShowConfirmModal(false);
    const showConfirmOrderModal = () => setShouldShowConfirmModal(true);
    // TODO: Uncomment this when we're ready to remove the modal
    // const showConfirmOrderModal = () => {
    //     if (is_buy_order_for_user) {
    //         setShouldShowConfirmModal(true);
    //     } else {
    //         order_store.confirmOrderRequest(id);
    //     }
    // };

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
                    <div className='order-details-card__footer--right'>
                        <Button.Group>
                            <Button large tertiary onClick={showComplainOrderModal}>
                                <Localize i18n_default_text='Complain' />
                            </Button>
                            <Button large primary onClick={showConfirmOrderModal}>
                                <Localize i18n_default_text="I've received payment" />
                            </Button>
                        </Button.Group>
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
                    <div className='order-details-card__footer--right'>
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
