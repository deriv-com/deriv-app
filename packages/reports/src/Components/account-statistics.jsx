import React from 'react';
import PropTypes from 'prop-types';
import { MobileWrapper, Money, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const AccountStatistics = ({ account_statistics, currency }) => {
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
};

AccountStatistics.propTypes = {
    account_statistics: PropTypes.object,
    currency: PropTypes.string,
};

export default connect(({ modules, client }) => ({
    account_statistics: modules.statement.account_statistics,
    currency: client.currency,
}))(AccountStatistics);
