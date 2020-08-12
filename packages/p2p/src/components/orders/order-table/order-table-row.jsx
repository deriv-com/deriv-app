import { Table } from '@deriv/components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { secondsToTimer } from 'Utils/date-time';
import ServerTime from 'Utils/server-time';

const OrderRowComponent = React.memo(({ data, onOpenDetails, style, is_active }) => {
    const {
        // advertiser_name,
        display_transaction_amount,
        display_offer_amount,
        display_status,
        id,
        order_purchase_datetime,
        order_expiry_millis,
        offer_currency,
        transaction_currency,
        is_buyer,
        is_buyer_confirmed,
        is_buyer_cancelled,
        is_expired,
        is_pending,
        is_completed,
        is_refunded,
    } = data;
    const [remaining_time, setRemainingTime] = React.useState();
    const { LocalStorage } = React.useContext(Dp2pContext);

    let interval;

    const countDownTimer = () => {
        const distance = ServerTime.getDistanceToServerTime(order_expiry_millis);
        const timer = secondsToTimer(distance);

        if (distance < 0) {
            setRemainingTime(localize('expired'));
            if (interval) clearInterval(interval);
        } else {
            setRemainingTime(timer);
        }
    };

    React.useEffect(() => {
        countDownTimer();
        interval = setInterval(countDownTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    // const max_word_count = 22;
    // let counter_party = '-';

    // if (advertiser_name !== '') {
    //     counter_party =
    //         advertiser_name.length > max_word_count
    //             ? `${advertiser_name.substring(0, max_word_count)}...`
    //             : advertiser_name;
    // }

    const offer_amount = `${display_offer_amount} ${offer_currency}`;
    const transaction_amount = `${display_transaction_amount} ${transaction_currency}`;
    return (
        <div onClick={() => onOpenDetails(data)} style={style}>
            <Table.Row
                className={classNames('orders__table-row orders__table-grid', {
                    'orders__table-grid--active': is_active,
                    'orders__table-row--attention': !LocalStorage?.hasReadNotification?.(id),
                })}
            >
                <Table.Cell>{is_buyer ? localize('Buy') : localize('Sell')}</Table.Cell>
                <Table.Cell>{id}</Table.Cell>
                {/* <Table.Cell>{counter_party}</Table.Cell> */}
                <Table.Cell>
                    <div
                        className={classNames('orders__table-status', {
                            'orders__table-status--primary':
                                (is_buyer_confirmed && !is_buyer) || (is_buyer && is_pending),
                            'orders__table-status--secondary':
                                (!is_buyer && is_pending) || (is_buyer_confirmed && is_buyer),
                            'orders__table-status--success': is_completed,
                            // 'orders__table-status--info': is_refunded,
                            'orders__table-status--disabled': is_buyer_cancelled || is_expired || is_refunded,
                        })}
                    >
                        {display_status}
                    </div>
                </Table.Cell>
                <Table.Cell>{is_buyer ? transaction_amount : offer_amount}</Table.Cell>
                <Table.Cell>{is_buyer ? offer_amount : transaction_amount}</Table.Cell>
                <Table.Cell>
                    {is_active ? <div className='orders__table-time'>{remaining_time}</div> : order_purchase_datetime}
                </Table.Cell>
            </Table.Row>
        </div>
    );
});

OrderRowComponent.propTypes = {
    data: PropTypes.shape({
        display_offer_amount: PropTypes.string,
        display_status: PropTypes.string,
        display_transaction_amount: PropTypes.string,
        offer_currency: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        order_purchase_datetime: PropTypes.string,
        transaction_currency: PropTypes.string,
        is_buyer: PropTypes.bool,
    }),
    onOpenDetails: PropTypes.func,
    style: PropTypes.object,
};

OrderRowComponent.displayName = 'OrderRowComponent';

export default OrderRowComponent;
