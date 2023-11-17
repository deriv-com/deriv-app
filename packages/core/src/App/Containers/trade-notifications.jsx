import React from 'react';
import { MobileWrapper, Text, Money } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getCardLabels } from '@deriv/shared';

const TradeNotifications = ({ notifications = [] }) => {
    if (!notifications.length) return null;

    return (
        <MobileWrapper>
            {notifications.map(notification => {
                const { buy_price, contract_id, currency, contract_type, profit, status, symbol } = notification;

                return (
                    <div className='dc-toast-popup-mobile' key={contract_id}>
                        <Text as='p' size='xxs' className='dc-toast__notification'>
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
                        <Text as='p' size='xxs' className='dc-toast__notification'>
                            {status === 'open' ? getCardLabels().STAKE : getCardLabels().TOTAL_PROFIT_LOSS}
                            <Text size='xxs' weight='bold'>
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
                );
            })}
        </MobileWrapper>
    );
};

export default TradeNotifications;
