import React from 'react';
import { observer } from 'mobx-react';
import { MobileWrapper, Money, SwipeableNotification, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { getCardLabels, getContractPath } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const TradeNotifications = observer(({ show_trade_notifications }: { show_trade_notifications?: boolean }) => {
    const {
        notifications: { removeTradeNotifications, trade_notifications },
    } = useStore();
    if (!show_trade_notifications || !trade_notifications.length) return null;

    return (
        <MobileWrapper>
            <div className='trade-notifications'>
                {trade_notifications.slice(0, 3).map(notification => {
                    const {
                        buy_price,
                        contract_id,
                        currency,
                        contract_type,
                        id,
                        is_opened,
                        profit,
                        symbol,
                        timestamp,
                    } = notification;
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
                                                status: is_opened ? localize('opened') : localize('closed'),
                                                symbol,
                                                trade_type_name: contract_type,
                                            }}
                                            shouldUnescape
                                        />
                                    </Text>
                                    <Text as='p' size='xxxs' line_height='s'>
                                        {is_opened ? getCardLabels().STAKE : getCardLabels().TOTAL_PROFIT_LOSS}{' '}
                                        <Text size='xxxs' line_height='s' weight='bold'>
                                            <Money
                                                amount={is_opened ? buy_price : profit}
                                                currency={currency}
                                                has_sign
                                                should_format
                                                show_currency
                                            />
                                        </Text>
                                    </Text>
                                </React.Fragment>
                            }
                            is_failure={!is_opened && profit < 0}
                            is_success={!is_opened && profit >= 0}
                            onUnmount={() => removeTradeNotifications(id)}
                            redirect_to={getContractPath(contract_id)}
                            timestamp={timestamp}
                            visibility_duration_ms={3000}
                        />
                    );
                })}
            </div>
        </MobileWrapper>
    );
});

export default TradeNotifications;
