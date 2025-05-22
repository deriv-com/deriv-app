import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

export const TradingDisabledByResidenceModalContent = observer(() => {
    const { client } = useStore();
    const { account_time_of_closure } = client;

    return (
        <div className='trading-disabled-by-residence-modal__content'>
            <Icon icon='IcCashierLocked' size={96} />
            <Text as='h1' align='center' weight='bold'>
                <Localize i18n_default_text='Trading disabled' />
            </Text>
            <Text align='center' size='xs'>
                <Localize
                    i18n_default_text='Due to business changes, client accounts in your country are to be closed. Withdraw any remaining funds by {{date}}.'
                    values={{
                        date: formatDate(account_time_of_closure, 'DD MMM YYYY'),
                    }}
                />
            </Text>
        </div>
    );
});
