import React from 'react';
import { MobileWrapper, Money, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useReportsStore } from 'Stores/useReportsStores';

const AccountStatistics = observer(() => {
    const { client } = useStore();
    const { statement } = useReportsStore();
    const { currency } = client;
    const { account_statistics } = statement;

    return (
        <div className='statement__account-statistics'>
            <div className='statement__account-statistics-item'>
                <div className='statement__account-statistics--is-rectangle'>
                    <Text color='less-prominent' className='statement__account-statistics-title'>
                        {localize('Total deposits')} <MobileWrapper> ({currency}) </MobileWrapper>
                    </Text>
                    <Text
                        color='prominent'
                        weight='bold'
                        align='center'
                        className='statement__account-statistics-amount'
                    >
                        <Money amount={account_statistics.total_deposits} currency={currency} />
                    </Text>
                </div>
            </div>
            <div className='statement__account-statistics-item statement__account-statistics-total-withdrawal'>
                <div className='statement__account-statistics--is-rectangle'>
                    <Text color='less-prominent' className='statement__account-statistics-title'>
                        {localize('Total withdrawals')} <MobileWrapper> ({currency}) </MobileWrapper>
                    </Text>
                    <Text
                        color='prominent'
                        weight='bold'
                        align='center'
                        className='statement__account-statistics-amount'
                    >
                        <Money amount={account_statistics.total_withdrawals} currency={currency} />
                    </Text>
                </div>
            </div>
            <div className='statement__account-statistics-item'>
                <div className='statement__account-statistics--is-rectangle'>
                    <Text color='less-prominent' className='statement__account-statistics-title'>
                        {localize('Net deposits')} <MobileWrapper> ({currency}) </MobileWrapper>
                    </Text>
                    <Text
                        color='prominent'
                        weight='bold'
                        align='center'
                        className='statement__account-statistics-amount'
                    >
                        <Money
                            amount={account_statistics.total_deposits - account_statistics.total_withdrawals}
                            currency={currency}
                        />
                    </Text>
                </div>
            </div>
        </div>
    );
});

export default AccountStatistics;
