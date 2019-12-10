import React         from 'react';
import PropTypes     from 'prop-types';
import {
    Button,
    Dialog }         from 'deriv-components';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';
import Popup         from '../popup.jsx';
import { localize }  from '../../i18next';
import './order-details.scss';

const OrderInfoBlock = ({ label, value }) => (
    <div className='order-details__info-block'>
        <p className='order-details__info-block-label'>{ label }</p>
        <strong className='order-details__info-block-value'>{ value }</strong>
    </div>
);

OrderInfoBlock.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
};

const OrderDetailsStatusBlock = ({ order_details }) => {
    const {
        is_buyer,
        is_buyer_cancelled,
        is_buyer_confirmed,
        is_expired,
        is_pending,
        is_seller_confirmed,
    } = order_details;

    return (
        <h2 className='order-details__header-status'>
            { is_pending && is_buyer &&
                localize('Please pay')
            }
            { is_pending && !is_buyer &&
                localize('Wait for payment')
            }
            { is_buyer_cancelled && is_buyer &&
                localize('You have cancelled this order')
            }
            { is_buyer_cancelled && !is_buyer &&
                localize('Buyer has cancelled this order')
            }
            { is_expired &&
                localize('Cancelled due to timeout')
            }
            { is_buyer_confirmed && is_buyer &&
                localize('Wait for release')
            }
            { is_buyer_confirmed && !is_buyer &&
                localize('Confirm payment')
            }
            { is_seller_confirmed &&
                localize('Order complete')
            }
        </h2>
    );
};

OrderDetailsStatusBlock.propTypes = {
    order_details: PropTypes.object,
};

const OrderDetailsAmountBlock = ({ order_details }) => (
    (order_details.is_pending || order_details.is_buyer_confirmed) ? (
        <h1 className='order-details__header-amount'>
            { `${order_details.transaction_currency} ${order_details.display_transaction_amount}` }
        </h1>
    ) : null
);

OrderDetailsAmountBlock.propTypes = {
    order_details: PropTypes.object,
};

const OrderDetailsTimerBlock = ({ order_details }) => {
    return (order_details.is_pending || order_details.is_buyer_confirmed) ? (
        <div className='order-details__header-timer'>
            <p>{ localize('Time left') }</p>
            <p className='order-details__header-timer-counter'>
                { order_details.display_remaining_time }
            </p>
        </div>
    ) : null;
};

OrderDetailsTimerBlock.propTypes = {
    order_details: PropTypes.object,
};

const OrderActionsBlock = ({ cancelPopup, order_details, showPopup }) => {
    const {
        is_buyer,
        is_buyer_confirmed,
        is_pending,
        offer_amount,
        offer_currency,
        price_rate,
        transaction_currency,
    } = order_details;
    let buttons_to_render = null;

    const cancelOrder = () => {
        const options = {
            title         : localize('Cancel this order?'),
            message       : localize('There will be no refund after canceling the order. If you have paid, please do not cancel the order.'),
            confirm_text  : localize('Cancel this order'),
            onClickConfirm: cancelPopup,
        };
        showPopup(options);
    };

    const paidOrder = () => {
        // TODO [p2p-order-api] call paid api
        const options = {
            title         : localize('Confirm this payment?'),
            message       : localize('Make sure you have successfully sent the funds to the seller’s bank account or e-wallet mentioned above.'),
            has_cancel    : true,
            cancel_text   : localize('I didn\'t pay yet'),
            confirm_text  : localize('I\'ve paid'),
            onClickConfirm: cancelPopup,
        };
        showPopup(options);
    };

    const receivedFunds = () => {
        const options = {
            title            : localize('Have you received funds?'),
            message          : localize('Make sure that you have logged in your bank account or other e-wallet to check the receipt.'),
            need_confirmation: true,
            offer            : {
                // TODO: [p2p-fix-schema-name] fix the naming according to the schema
                currency : offer_currency,
                asset    : transaction_currency,
                fix_price: price_rate,
                amount   : offer_amount,
            },
            onClickConfirm: cancelPopup,
        };
        showPopup(options);
    };

    if (is_pending && is_buyer) {
        buttons_to_render = (
            <React.Fragment>
                <Button className='order-details__actions-button' large secondary onClick={cancelOrder}>{ localize('Cancel order') }</Button>
                <Button className='order-details__actions-button' large primary onClick={paidOrder}>{ localize('I\'ve paid') }</Button>
            </React.Fragment>
        );
    }

    if ((is_pending || is_buyer_confirmed) && !is_buyer) {
        buttons_to_render = (
            <Button className='order-details__actions-button' large primary onClick={receivedFunds}>{ localize('I\'ve received funds') }</Button>
        );
    }

    return buttons_to_render;
};

OrderActionsBlock.propTypes = {
    cancelPopup  : PropTypes.func,
    order_details: PropTypes.object,
    showPopup    : PropTypes.func,
};

const OrderDetailsResultMessage = ({ order_details }) => {

    if (order_details.is_seller_confirmed && order_details.is_buyer) {
        return (
            <p className='order-details__wrapper-message order-details__wrapper-message--success'>
                { localize('{{offered_currency}} {{offered_amount}} was deposited on your account',
                    {
                        offered_currency: order_details.offer_currency,
                        offered_amount  : order_details.display_offer_amount,
                    })
                }
            </p>
        );
    }

    if (order_details.is_seller_confirmed && !order_details.is_buyer) {
        return (
            <p className='order-details__wrapper-message order-details__wrapper-message--success'>
                { localize('You sold {{offered_currency}} {{offered_amount}}',
                    {
                        offered_currency: order_details.offer_currency,
                        offered_amount  : order_details.display_offer_amount,
                    })
                }
            </p>
        );
    }
    // TODO: [p2p-timeout-status-check] - Check if order has timed out and add timeout message
    return null;
};

OrderDetailsResultMessage.propTypes = {
    order_details: PropTypes.object,
};

const OrderDetails = ({
    order_details,
}) => {
    const {
        advertiser_notes,
        display_offer_amount,
        display_price_rate,
        display_transaction_amount,
        is_buyer,
        is_buyer_confirmed,
        is_expired,
        offer_currency,
        order_id,
        order_purchase_datetime,
        other_party,
        transaction_currency,
    } = order_details;
    const [show_popup, setShowPopup] = React.useState(false);
    const [popup_options, setPopupOptions] = React.useState({});

    const onCancelClick = () => setShowPopup(false);

    const handleShowPopup = (options) => {
        setPopupOptions(options);
        setShowPopup(true);
    };

    return (
        <div className='order-details'>
            <div className='order-details__wrapper order-details__wrapper--outer'>
                <OrderDetailsResultMessage order_details={ order_details } />
                <div className='order-details__wrapper--inner'>
                    <div className='order-details__header'>
                        <span>
                            <OrderDetailsStatusBlock order_details={ order_details } />
                            <OrderDetailsAmountBlock order_details={ order_details } />
                        </span>
                        <OrderDetailsTimerBlock order_details={ order_details } />
                    </div>
                    <div className='deriv-p2p__separator' />
                    <div className='order-details__info'>
                        <OrderInfoBlock label={ localize('Advertiser notes') } value={ advertiser_notes } />
                        <div className='order-details__info-columns'>
                            <div className='order-details__info--left'>
                                <OrderInfoBlock label={ is_buyer ? localize('Send') : localize('Receive') } value={ `${transaction_currency} ${display_transaction_amount}` } />
                                <OrderInfoBlock label={ localize('Price') } value={ `${transaction_currency} ${display_price_rate}` } />
                                <OrderInfoBlock label={ localize('Order ID') } value={ order_id } />
                            </div>
                            <div className='order-details__info--right'>
                                <OrderInfoBlock label={ is_buyer ? localize('Receive') : localize('Send') } value={ `${offer_currency} ${display_offer_amount}` } />
                                <OrderInfoBlock label={ is_buyer ? localize('Seller') : localize('Buyer') } value={ other_party } />
                                <OrderInfoBlock label={ localize('Time') } value={ order_purchase_datetime.toString() } />
                            </div>
                        </div>
                    </div>
                    { (is_buyer_confirmed || (is_expired && is_buyer)) &&
                        <React.Fragment>
                            <div className='deriv-p2p__separator' />
                            <div className='order-details__footer'>
                                <a className='link' rel='noopener noreferrer' target='_blank' href='mailto:support@deriv.com'>{ localize('Complain') }</a>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>

            <FooterActions>
                <OrderActionsBlock
                    cancelPopup={onCancelClick}
                    showPopup={handleShowPopup}
                    order_details={order_details}
                />
            </FooterActions>
            {show_popup && (
                <div className='orders__dialog'>
                    <Dialog is_visible={show_popup}>
                        <Popup {...popup_options} onCancel={onCancelClick} />
                    </Dialog>
                </div>
            )}
        </div>
    );
};

OrderDetails.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetails;
