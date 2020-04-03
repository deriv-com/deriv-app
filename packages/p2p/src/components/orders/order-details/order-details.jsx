import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import FooterActions from 'Components/footer-actions/footer-actions.jsx';
import OrderDetailsStatusBlock from './order-details-status-block.jsx';
import OrderInfoBlock from './order-info-block.jsx';
import OrderDetailsAmountBlock from './order-details-amount-block.jsx';
import OrderDetailsTimerBlock from './order-details-timer-block.jsx';
import OrderActionsBlock from './order-actions-block.jsx';
import OrderDetailsResultMessage from './order-details-result-message.jsx';
import Popup from '../popup.jsx';

import './order-details.scss';

const OrderDetails = ({ order_details }) => {
    const {
        advertiser_id,
        advertiser_name,
        advertiser_instructions,
        contact_info,
        display_offer_amount,
        display_price_rate,
        display_transaction_amount,
        is_buyer,
        is_buyer_confirmed,
        is_expired,
        offer_currency,
        id,
        order_purchase_datetime,
        transaction_currency,
    } = order_details;
    const [show_popup, setShowPopup] = React.useState(false);
    const [popup_options, setPopupOptions] = React.useState({});

    const { email_domain, advertiser_id: client_advertiser_id } = React.useContext(Dp2pContext);
    const is_my_ad = advertiser_id === client_advertiser_id;

    const onCancelClick = () => setShowPopup(false);
    const handleShowPopup = options => {
        setPopupOptions(options);
        setShowPopup(true);
    };

    return (
        <div className='order-details'>
            <div className='order-details__wrapper order-details__wrapper--outer'>
                <OrderDetailsResultMessage order_details={order_details} />
                <div className='order-details__wrapper--inner'>
                    <div className='order-details__header'>
                        <span>
                            <OrderDetailsStatusBlock order_details={order_details} />
                            <OrderDetailsAmountBlock order_details={order_details} />
                            {!is_expired && (
                                <React.Fragment>
                                    <h1 className='order-details__header-method'>
                                        {order_details.display_payment_method}
                                    </h1>
                                    {order_details.payment_info && (
                                        <div className='order-details__header-payment-info'>
                                            {order_details.payment_info}
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </span>
                        <OrderDetailsTimerBlock order_details={order_details} />
                    </div>
                    <div className='deriv-p2p__separator' />
                    <div className='order-details__info'>
                        <div className='order-details__info-columns'>
                            {!is_my_ad && (
                                <div className='order-details__info--left'>
                                    <OrderInfoBlock
                                        label={is_buyer ? localize('Seller') : localize('Buyer')}
                                        value={advertiser_name}
                                    />
                                </div>
                            )}
                            <div className='order-details__info--right'>
                                <OrderInfoBlock
                                    label={localize('Rate ({{display_offer_amount}} {{offer_currency}})', {
                                        display_offer_amount,
                                        offer_currency,
                                    })}
                                    value={`${display_price_rate} ${transaction_currency}`}
                                />
                            </div>
                        </div>
                        {!is_my_ad && (
                            <OrderInfoBlock
                                label={is_buyer ? localize('Seller instructions') : localize('Buyer instructions')}
                                value={advertiser_instructions || '-'}
                            />
                        )}
                        {is_buyer && (
                            <OrderInfoBlock label={localize('Seller contact details')} value={contact_info || '-'} />
                        )}
                        <div className='order-details__info-columns'>
                            <div className='order-details__info--left'>
                                <OrderInfoBlock
                                    label={is_buyer ? localize('Send') : localize('Receive')}
                                    value={`${display_transaction_amount} ${transaction_currency}`}
                                />
                                <OrderInfoBlock label={localize('Order ID')} value={id} />
                            </div>
                            <div className='order-details__info--right'>
                                <OrderInfoBlock
                                    label={is_buyer ? localize('Receive') : localize('Send')}
                                    value={`${display_offer_amount} ${offer_currency}`}
                                />
                                <OrderInfoBlock label={localize('Time')} value={order_purchase_datetime} />
                            </div>
                        </div>
                    </div>
                    {(is_buyer_confirmed || (is_expired && is_buyer)) && (
                        <React.Fragment>
                            <div className='deriv-p2p__separator' />
                            <div className='order-details__footer'>
                                <p>
                                    <Localize
                                        i18n_default_text='If you have a complaint, please email <0>{{support_email}}</0> and include your order ID.'
                                        values={{ support_email: `support@${email_domain}` }}
                                        components={[
                                            <a
                                                key={0}
                                                className='link'
                                                rel='noopener noreferrer'
                                                target='_blank'
                                                href={`mailto:support@${email_domain}`}
                                            />,
                                        ]}
                                    />
                                </p>
                            </div>
                        </React.Fragment>
                    )}
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
