import React from 'react';
import { MobileWrapper, Money } from '@deriv/components';
import { localize } from '@deriv/translations';

const AccountStatistics = (account_statistics, currency) => (
    <React.Fragment>
        <div className='statement__account-statistics'>
            <div className='statement__account-statistics-item'>
                <div className='statement__account-statistics--is-rectangle'>
                    <span className='statement__account-statistics-title'>
                        {localize('Total deposits')} <MobileWrapper> ({currency}) </MobileWrapper>
                    </span>
                    <span className='statement__account-statistics-amount'>
                        <Money amount={account_statistics.total_deposits} currency={currency} />
                    </span>
                </div>
            </div>
            <div className='statement__account-statistics-item statement__account-statistics-total-withdrawal'>
                <div className='statement__account-statistics--is-rectangle'>
                    <span className='statement__account-statistics-title'>
                        {localize('Total withdrawals')} <MobileWrapper> ({currency}) </MobileWrapper>
                    </span>
                    <span className='statement__account-statistics-amount'>
                        <Money amount={account_statistics.total_withdrawals} currency={currency} />
                    </span>
                </div>
            </div>
            <div className='statement__account-statistics-item'>
                <div className='statement__account-statistics--is-rectangle'>
                    <span className='statement__account-statistics-title'>
                        {localize('Net deposits')} <MobileWrapper> ({currency}) </MobileWrapper>
                    </span>
                    <span className='statement__account-statistics-amount'>
                        <Money
                            amount={account_statistics.total_deposits - account_statistics.total_withdrawals}
                            currency={currency}
                        />
                    </span>
                </div>
            </div>
        </div>
    </React.Fragment>
);

export default AccountStatistics;
