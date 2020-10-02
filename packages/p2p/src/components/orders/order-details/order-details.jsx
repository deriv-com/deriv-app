import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { ThemedScrollbars } from '@deriv/components';
import { getFormattedText, useIsMounted } from '@deriv/shared';
import { Localize, localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import OrderDetailsFooter from './order-details-footer.jsx';
import OrderDetailsChatbox from './order-details-chatbox.jsx';
import OrderDetailsTimer from './order-details-timer.jsx';
import OrderInfoBlock from './order-info-block.jsx';
import Popup from '../popup.jsx';
import './order-details.scss';

const OrderDetails = ({ order_information, chat_info }) => {
    const {
        account_currency,
        advert_details,
        amount_display,
        chat_channel_url,
        contact_info,
        has_timer_expired,
        id,
        is_buyer_confirmed_order,
        is_completed_order,
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
        should_show_order_footer,
        status_string,
    } = order_information;

    const [channel_url, setChannelUrl] = React.useState(chat_channel_url);
    const [should_show_popup, setShouldShowPopup] = React.useState(false);
    const [popup_options, setPopupOptions] = React.useState({});
    const isMounted = useIsMounted();

    const onCancelClick = () => setShouldShowPopup(false);
    const handleShowPopup = options => {
        setPopupOptions(options);
        setShouldShowPopup(true);
    };

    React.useEffect(() => {
        if (isMounted()) {
            if (!channel_url) {
                // If order_information doesn't have channel_url this is a new order
                // and we need to instruct BE to create a chat on Sendbird's side.
                requestWS({ p2p_chat_create: 1, order_id: id }).then(response => {
                    if (response.error) {
                        // TODO: Handle error.
                        return;
                    }

                    if (isMounted()) {
                        setChannelUrl(response.p2p_chat_create);
                    }
                });
            }
        }
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
                                        'order-details__header-status--success': is_completed_order,
                                    }
                                )}
                            >
                                {status_string}
                            </div>
                            {is_completed_order && (
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
                            <OrderDetailsTimer order_information={order_information} />
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
                    {should_show_order_footer && (
                        <OrderDetailsFooter
                            cancelPopup={onCancelClick}
                            showPopup={handleShowPopup}
                            order_information={order_information}
                        />
                    )}
                </div>
                {channel_url && (
                    <OrderDetailsChatbox
                        {...chat_info}
                        channel_url={chat_channel_url}
                        nickname={other_user_details.name}
                    />
                )}
                <Popup
                    {...popup_options}
                    onCancel={onCancelClick}
                    should_show_popup={should_show_popup}
                    setShouldShowPopup={setShouldShowPopup}
                />
            </div>
        </div>
    );
};

OrderDetails.propTypes = {
    chat_info: PropTypes.object,
    order_information: PropTypes.object,
};

export default OrderDetails;
