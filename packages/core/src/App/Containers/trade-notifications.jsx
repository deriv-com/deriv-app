import React from 'react';
import classNames from 'classnames';
import { MobileWrapper, Text, Money } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getCardLabels } from '@deriv/shared';

const TradeNotifications = ({ notifications = [] }) => {
    if (!notifications.length) return null;

    return (
        <MobileWrapper>
            <div className='swipeable-notifications'>
                {notifications.map(notification => {
                    const { buy_price, contract_id, currency, contract_type, profit, status, symbol, timestamp } =
                        notification;
                    const seconds = Math.floor(Math.abs(Date.now() - timestamp) / 1000);
                    return (
                        <div
                            className={classNames('swipeable-notifications__item', {
                                'swipeable-notifications__item--lost': status !== 'open' && profit < 0,
                                'swipeable-notifications__item--won': status !== 'open' && profit >= 0,
                            })}
                            key={contract_id}
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
                                    {status === 'open' ? getCardLabels().STAKE : getCardLabels().TOTAL_PROFIT_LOSS}{' '}
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
                        </div>
                    );
                })}
            </div>
        </MobileWrapper>
    );
};

export default TradeNotifications;
