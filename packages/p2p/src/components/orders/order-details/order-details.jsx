import React         from 'react';
import { localize }  from 'deriv-translations';
import { Button }    from 'deriv-components';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';
import './order-details.scss';

const OrderInfoBlock = ({ label, value }) => (
    <div className='order-details__info-block'>
        <p className='order-details__info-block-label'>{ label }</p>
        <strong className='order-details__info-block-value'>{ value }</strong>
    </div>
);

const OrderDetailsStatusBlock = ({ order_details }) => (
    <h2 className='order-details__header-status'>
        { order_details.is_pending && order_details.is_buyer &&
            localize('Please pay')
        }
        { order_details.is_pending && !order_details.is_buyer &&
            localize('Wait for payment')
        }
        { order_details.is_buyer_cancelled && order_details.is_buyer &&
            localize('You have cancelled this order')
        }
        { order_details.is_buyer_cancelled && !order_details.is_buyer &&
            localize('Buyer has cancelled this order')
        }
        { order_details.is_expired &&
            localize('Cancelled due to timeout')
        }
        { order_details.is_buyer_confirmed && order_details.is_buyer &&
            localize('Wait for release')
        }
        { order_details.is_buyer_confirmed && !order_details.is_buyer &&
            localize('Confirm payment')
        }
        { order_details.is_seller_confirmed &&
            localize('Order complete')
        }
    </h2>
);

const OrderDetailsAmountBlock = ({ order_details }) => {
    return (order_details.is_pending || order_details.is_buyer_confirmed) ? (
        <h1 className='order-details__header-amount'>
            { `${order_details.transaction_currency} ${order_details.display_transaction_amount}` }
        </h1>
    ) : null;
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

const OrderActionsBlock = ({ order_details }) => {
    const {
        is_buyer,
        is_buyer_confirmed,
        is_pending,
    } = order_details;
    let buttons_to_render = null;

    if (is_pending && is_buyer) {
        buttons_to_render = (
            <React.Fragment>
                <Button className='order-details__actions-button' large secondary onClick={ () => console.log('Cancel order') }>{ localize('Cancel order') }</Button>
                <Button className='order-details__actions-button' large primary onClick={ () => console.log('I\'ve paid') }>{ localize('I\'ve paid') }</Button>
            </React.Fragment>
        );
    }

    if ((is_pending || is_buyer_confirmed) && !is_buyer) {
        buttons_to_render = (
            <Button className='order-details__actions-button' large primary onClick={ () => console.log('I\'ve received funds') }>{ localize('I\'ve received funds') }</Button>
        );
    }

    return buttons_to_render;
};

const OrderDetails = ({
    order_details,
}) => {
    return (
        <div className='order-details'>
            <div className='order-details__wrapper order-details__wrapper--outer'>
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
                        <OrderInfoBlock label={ localize('Advertiser notes') } value={ order_details.advertiser_notes } />
                        <div className='order-details__info-columns'>
                            <div className='order-details__info--left'>
                                <OrderInfoBlock label={ order_details.is_buyer ? localize('Send') : localize('Receive') } value={ `${order_details.transaction_currency} ${order_details.display_transaction_amount}` } />
                                <OrderInfoBlock label={ localize('Price') } value={ `${order_details.transaction_currency} ${order_details.display_price_rate}` } />
                                <OrderInfoBlock label={ localize('Order ID') } value={ order_details.order_id } />
                            </div>
                            <div className='order-details__info--right'>
                                <OrderInfoBlock label={ order_details.is_buyer ? localize('Receive') : localize('Send') } value={ `${order_details.offer_currency} ${order_details.display_offer_amount}` } />
                                <OrderInfoBlock label={ order_details.is_buyer ? localize('Seller') : localize('Buyer') } value={ order_details.other_party } />
                                <OrderInfoBlock label={ localize('Time') } value={ order_details.order_purchase_datetime.toString() } />
                            </div>
                        </div>
                    </div>
                    { (order_details.is_buyer_confirmed || (order_details.is_expired && order_details.is_buyer)) &&
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
                <OrderActionsBlock order_details={ order_details } />
            </FooterActions>
        </div>
    );
};

export default OrderDetails;
