import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { ThemedScrollbars } from '@deriv/components';
import { getFormattedText } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';
import OrderDetailsFooter from './order-details-footer.jsx';
import OrderDetailsChatbox from './order-details-chatbox.jsx';
import OrderDetailsTimer from './order-details-timer.jsx';
import OrderInfoBlock from './order-info-block.jsx';
import Popup from '../orders/popup.jsx';
import './order-details.scss';

const OrderDetails = observer(() => {
    const { general_store, order_store, order_details_store } = useStores();

    const {
        account_currency,
        advert_details,
        amount_display,
        chat_channel_url,
        contact_info,
        has_timer_expired,
        id,
        is_buyer_confirmed_order,
        is_pending_order,
        labels,
        local_currency,
        other_user_details,
        payment_info,
        price,
        purchase_time,
        rate,
        should_highlight_alert,
        should_highlight_danger,
        should_highlight_success,
        should_show_order_footer,
        status_string,
    } = order_store.order_information;

    React.useEffect(() => {
        order_details_store.setChatChannelUrl(chat_channel_url);
        order_details_store.createChatForNewOrder(id);
    }, []);

    return (
        <div className='order-details'>
            <div className='order-details__container'>
                <div className='order-details__wrapper'>
                    <div className='order-details__header'>
                        <div className='order-details__header--left'>
                            <div
                                className={classNames(
                                    'order-details__header-status',
                                    'order-details__header-status--info',
                                    {
                                        'order-details__header-status--alert': should_highlight_alert,
                                        'order-details__header-status--danger': should_highlight_danger,
                                        'order-details__header-status--success': should_highlight_success,
                                    }
                                )}
                            >
                                {status_string}
                            </div>
                            {should_highlight_success && (
                                <div className='order-details__wrapper-message'>{labels.result_string}</div>
                            )}
                            {!has_timer_expired && (is_pending_order || is_buyer_confirmed_order) && (
                                <div className='order-details__header-amount'>
                                    {getFormattedText(price, local_currency)}
                                </div>
                            )}
                            <div className='order-details__header-id'>
                                <Localize i18n_default_text='Order ID {{ id }}' values={{ id }} />
                            </div>
                        </div>
                        <div className='order-details__header--right'>
                            <OrderDetailsTimer />
                        </div>
                    </div>
                    <ThemedScrollbars height='calc(100% - 11.2rem)'>
                        {/* Above calculation is: (parent height - order header height) */}
                        <div className='order-details__info'>
                            <div className='order-details__info-columns'>
                                <div className='order-details__info--left'>
                                    <OrderInfoBlock label={labels.other_party_role} value={other_user_details.name} />
                                </div>
                                <div className='order-details__info--right'>
                                    <OrderInfoBlock
                                        label={localize('Rate (1 {{ account_currency }})', { account_currency })}
                                        value={getFormattedText(rate, local_currency)}
                                    />
                                </div>
                            </div>
                            <div className='order-details__info-columns'>
                                <div className='order-details__info--left'>
                                    <OrderInfoBlock
                                        label={labels.left_send_or_receive}
                                        value={getFormattedText(price, local_currency)}
                                    />
                                    <OrderInfoBlock label={localize('Time')} value={purchase_time} />
                                </div>
                                <div className='order-details__info--right'>
                                    <OrderInfoBlock
                                        label={labels.right_send_or_receive}
                                        value={`${amount_display} ${account_currency}`}
                                    />
                                </div>
                            </div>
                            <OrderInfoBlock label={labels.payment_details} value={payment_info || '-'} />
                            <OrderInfoBlock label={labels.contact_details} value={contact_info || '-'} />
                            <OrderInfoBlock label={labels.instructions} value={advert_details.description || '-'} />
                        </div>
                    </ThemedScrollbars>
                    {should_show_order_footer && <OrderDetailsFooter cancelPopup={order_details_store.onCancelClick} />}
                </div>
                {order_details_store.chat_channel_url && (
                    <OrderDetailsChatbox
                        {...general_store.chat_info}
                        channel_url={chat_channel_url}
                        nickname={other_user_details.name}
                    />
                )}
                <Popup
                    {...order_details_store.popup_options}
                    onCancel={order_details_store.onCancelClick}
                    should_show_popup={order_details_store.should_show_popup}
                    setShouldShowPopup={order_details_store.setShouldShowPopup}
                />
            </div>
        </div>
    );
});

OrderDetails.propTypes = {
    chat_channel_url: PropTypes.string,
    chat_info: PropTypes.object,
    createChatForNewOrder: PropTypes.func,
    order_information: PropTypes.object,
    onCancelClick: PropTypes.func,
    popup_options: PropTypes.object,
    setChatChannelUrl: PropTypes.func,
    setShouldShowPopup: PropTypes.func,
    should_show_popup: PropTypes.bool,
};

export default OrderDetails;
