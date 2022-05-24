import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Text, Rating } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import OrderDetailsCancelModal from './order-details-cancel-modal.jsx';
import OrderDetailsComplainModal from './order-details-complain-modal.jsx';
import OrderDetailsConfirmModal from './order-details-confirm-modal.jsx';
import classNames from 'classnames';

const OrderDetailsFooter = observer(() => {
    const { order_store } = useStores();
    const {
        is_buy_order,
        is_my_ad,
        is_order_reviewable,
        is_sell_order,
        review_details,
        should_show_cancel_and_paid_button,
        should_show_complain_and_received_button,
        should_show_only_received_button,
        should_show_only_complain_button,
    } = order_store.order_information;

    console.log('review_details: ', { ...order_store.order_information });

    const is_buy_order_for_user = (is_buy_order && !is_my_ad) || (is_sell_order && is_my_ad);

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

    return (
        <React.Fragment>
            <div className={classNames('order-details-card__footer', 'order-details-card__footer--align-content')}>
                <div className='order-details-card__footer--left'>
                    {review_details ? (
                        <React.Fragment>
                            <Text size='m' weight='bold'>
                                <Localize i18n_default_text='Your transaction experience' />
                            </Text>
                            <section className='order-details-card__footer--show-review'>
                                <Rating
                                    value={review_details?.rating}
                                    readonly
                                    icon_selected={
                                        <Icon icon='IcStar' size={16} custom_color='var(--status-warning)' />
                                    }
                                    icon_unselected={
                                        <Icon icon='IcStar' size={16} custom_color='var(--status-unselect)' />
                                    }
                                />
                                <Icon
                                    icon={review_details?.recommended ? 'IcThumbsUp' : 'IcThumbsDown'}
                                    size={16}
                                    custom_color={
                                        review_details?.recommended ? 'var(--status-success)' : 'var(--status-danger)'
                                    }
                                />
                            </section>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <section className='order-details-card__footer--get-review'>
                                <Button
                                    large
                                    secondary
                                    is_disabled={!is_order_reviewable}
                                    className='order-details-card__footer--get-review-button'
                                >
                                    <Icon
                                        icon='IcStar'
                                        size={16}
                                        custom_color={
                                            is_order_reviewable ? 'var(--status-warning)' : 'var(--status-unselect)'
                                        }
                                    />
                                    <Text>{localize(is_order_reviewable ? 'Rate this transaction' : 'Not rated')}</Text>
                                </Button>
                                <Text size='xs' color='less-prominent'>
                                    {localize(
                                        is_order_reviewable
                                            ? 'You have until to rate this transaction'
                                            : 'You can no longer rate this transaction'
                                    )}
                                </Text>
                            </section>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
});

OrderDetailsFooter.propTypes = {
    order_information: PropTypes.object,
};

export default OrderDetailsFooter;
