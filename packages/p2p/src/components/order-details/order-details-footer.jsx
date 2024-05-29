import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import OrderDetailsComplainModal from './order-details-complain-modal.jsx';
import './order-details-footer.scss';

const OrderDetailsFooter = observer(() => {
    const { general_store, order_store } = useStores();
    const { showModal } = useModalManagerContext();
    const {
        id,
        is_buy_order_for_user,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_only_received_button,
        should_show_only_complain_button,
        chat_channel_url,
    } = order_store.order_information;

    const [should_show_complain_modal, setShouldShowComplainModal] = React.useState(false);

    const hideComplainOrderModal = () => setShouldShowComplainModal(false);
    const showComplainOrderModal = () => setShouldShowComplainModal(true);

    const showConfirmOrderModal = () => {
        if (is_buy_order_for_user) {
            general_store.showModal({ key: 'OrderDetailsConfirmModal', props: {} });
        } else {
            order_store.confirmOrderRequest(id);
        }
    };

    if (should_show_cancel_and_paid_button) {
        return (
            <React.Fragment>
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
                        <Button.Group>
                            <Button
                                large
                                secondary
                                onClick={() => showModal({ key: 'OrderDetailsCancelModal', props: {} })}
                                is_disabled={!chat_channel_url}
                            >
                                <Localize i18n_default_text='Cancel order' />
                            </Button>
                            <Button large primary onClick={showConfirmOrderModal} is_disabled={!chat_channel_url}>
                                <Localize i18n_default_text="I've paid" />
                            </Button>
                        </Button.Group>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    if (should_show_complain_and_received_button) {
        return (
            <React.Fragment>
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
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
            </React.Fragment>
        );
    }

    if (should_show_only_complain_button) {
        return (
            <React.Fragment>
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
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
                <div className='order-details-footer'>
                    <div className='order-details-footer--right'>
                        <Button large primary onClick={showConfirmOrderModal}>
                            <Localize i18n_default_text="I've received payment" />
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    return null;
});

OrderDetailsFooter.propTypes = {
    order_information: PropTypes.object,
};

export default OrderDetailsFooter;
