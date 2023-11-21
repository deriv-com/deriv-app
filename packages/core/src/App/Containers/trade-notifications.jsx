import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react';
import { MobileWrapper, Text, Money, HorizontalSwipe } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getCardLabels, getContractPath } from '@deriv/shared';
import { useStore } from '@deriv/stores';

const TradeNotifications = observer(({ show_trade_notifications }) => {
    const { notifications: { trade_notifications } = {} } = useStore();
    if (!show_trade_notifications || !trade_notifications.length) return null;

    return (
        <MobileWrapper>
            <div className='swipeable-notifications'>
                {trade_notifications.map(notification => {
                    const { buy_price, contract_id, currency, contract_type, profit, status, symbol, timestamp } =
                        notification;
                    const seconds = Math.floor(Math.abs(Date.now() - timestamp) / 1000);
                    return (
                        <HorizontalSwipe
                            is_left_swipe
                            is_right_swipe
                            key={contract_id}
                            left_hidden_component={<React.Fragment />}
                            left_hidden_component_width='100vw'
                            right_hidden_component={<React.Fragment />}
                            right_hidden_component_width='100vw'
                            visible_component={
                                <NavLink
                                    className={classNames('swipeable-notifications__item', {
                                        'swipeable-notifications__item--lost': status !== 'open' && profit < 0,
                                        'swipeable-notifications__item--won': status !== 'open' && profit >= 0,
                                    })}
                                    to={getContractPath(contract_id)}
                                >
                                    <div className='swipeable-notifications__item-content'>
                                        <Text as='p' size='xxxs' line_height='s'>
                                            <Localize
                                                i18n_default_text='<0>Trade {{status}}:</0> {{trade_type_name}} on {{symbol}}'
                                                components={[<strong key={0} />]}
                                                values={{
                                                    status: status === 'open' ? localize('opened') : localize('closed'),
                                                    symbol,
                                                    trade_type_name: contract_type,
                                                }}
                                                shouldUnescape
                                            />
                                        </Text>
                                        <Text as='p' size='xxxs' line_height='s'>
                                            {status === 'open'
                                                ? getCardLabels().STAKE
                                                : getCardLabels().TOTAL_PROFIT_LOSS}{' '}
                                            <Text size='xxxs' line_height='s' weight='bold'>
                                                <Money
                                                    amount={status === 'open' ? buy_price : profit}
                                                    currency={currency}
                                                    has_sign
                                                    should_format
                                                    show_currency
                                                />
                                            </Text>
                                        </Text>
                                    </div>
                                    <Text
                                        as='p'
                                        size='xxxs'
                                        line_height='s'
                                        className='swipeable-notifications__item-timestamp'
                                    >
                                        {seconds < 10 ? (
                                            <Localize i18n_default_text='now' />
                                        ) : (
                                            <Localize i18n_default_text='{{seconds}}s ago' values={{ seconds }} />
                                        )}
                                    </Text>
                                </NavLink>
                            }
                        />
                    );
                })}
            </div>
        </MobileWrapper>
    );
});

export default TradeNotifications;
