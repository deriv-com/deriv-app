import React                     from 'react';
import PropTypes                 from 'prop-types';
import { Dialog }                from 'deriv-components';
import { localize, Localize }    from 'Components/i18next';
import AgentContext              from 'Components/context/agent-context';
import FooterActions             from 'Components/footer-actions/footer-actions.jsx';
import OrderDetailsStatusBlock   from './order-details-status-block.jsx';
import OrderInfoBlock            from './order-info-block.jsx';
import OrderDetailsAmountBlock   from './order-details-amount-block.jsx';
import OrderDetailsTimerBlock    from './order-details-timer-block.jsx';
import OrderActionsBlock         from './order-actions-block.jsx';
import OrderDetailsResultMessage from './order-details-result-message.jsx';
import Popup                     from '../popup.jsx';

import './order-details.scss';

const OrderDetails = ({
    order_details,
}) => {
    const {
        advertiser_name,
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
        transaction_currency,
    } = order_details;
    const [show_popup, setShowPopup] = React.useState(false);
    const [popup_options, setPopupOptions] = React.useState({});

    const is_agent = React.useContext(AgentContext);
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
                                {is_agent && <OrderInfoBlock label={ is_buyer ? localize('Receive') : localize('Send') } value={ `${transaction_currency} ${display_transaction_amount}` } />}
                                {!is_agent && <OrderInfoBlock label={ is_buyer ? localize('Send') : localize('Receive') } value={ `${transaction_currency} ${display_transaction_amount}` } />}
                                <OrderInfoBlock label={ localize('Price') } value={ `${transaction_currency} ${display_price_rate}` } />
                                <OrderInfoBlock label={ localize('Order ID') } value={ order_id } />
                            </div>
                            <div className='order-details__info--right'>
                                {is_agent && <OrderInfoBlock label={ is_buyer ? localize('Send') : localize('Receive') } value={ `${offer_currency} ${display_offer_amount}` } />}
                                {!is_agent && <OrderInfoBlock label={ is_buyer ? localize('Receive') : localize('Send') } value={ `${offer_currency} ${display_offer_amount}` } />}
                                {is_agent && !is_buyer && <OrderInfoBlock label={localize('Seller')} value={ advertiser_name } />}
                                {!is_agent && is_buyer && <OrderInfoBlock label={localize('Seller')} value={ advertiser_name } />}
                                <OrderInfoBlock label={ localize('Time') } value={ order_purchase_datetime } />
                            </div>
                        </div>
                    </div>
                    { (is_buyer_confirmed || (is_expired && is_buyer)) &&
                        <React.Fragment>
                            <div className='deriv-p2p__separator' />
                            <div className='order-details__footer'>
                                <p>
                                    <Localize
                                        i18n_default_text='If you have a complaint, please email <0>{{support_email}}</0> and include your order ID.'
                                        values={{ support_email: 'support@deriv.com' }}
                                        components={[ <a key={0} className='link' rel='noopener noreferrer' target='_blank' href='mailto:support@deriv.com' /> ]}
                                    />
                                </p>
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
