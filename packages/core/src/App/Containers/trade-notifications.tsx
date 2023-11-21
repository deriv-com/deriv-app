import React from 'react';
import { observer } from 'mobx-react';
import { MobileWrapper, Money, SwipeableNotification, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { getCardLabels, getContractPath } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

const TradeNotifications = observer(({ show_trade_notifications }: { show_trade_notifications?: boolean }) => {
    const {
        notifications: { removeTradeNotifications, trade_notifications },
    } = useStore();
    if (!show_trade_notifications || !trade_notifications.length) return null;

    return (
        <MobileWrapper>
            <div className='trade-notifications'>
                {trade_notifications.map(notification => {
                    const { buy_price, contract_id, currency, contract_type, id, profit, status, symbol, timestamp } =
                        notification;
                    const seconds = Math.floor(Math.abs(Date.now() - timestamp) / 1000);

                    return (
                        <SwipeableNotification
                            key={id}
                            content={
                                <React.Fragment>
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
                                </React.Fragment>
                            }
                            displayed_time={
                                seconds < 10 ? (
                                    <Localize i18n_default_text='now' />
                                ) : (
                                    <Localize i18n_default_text='{{seconds}}s ago' values={{ seconds }} />
                                )
                            }
                            is_failure={status !== 'open' && profit < 0}
                            is_success={status !== 'open' && profit >= 0}
                            is_visible={seconds < 3}
                            onSwipeEnd={(should_remove_notification?: boolean) => {
                                if (should_remove_notification) {
                                    removeTradeNotifications(id);
                                }
                            }}
                            redirect_to={getContractPath(contract_id)}
                        />
                    );
                })}
            </div>
        </MobileWrapper>
    );
});

export default TradeNotifications;
