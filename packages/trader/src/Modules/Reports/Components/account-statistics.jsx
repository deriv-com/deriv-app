import React from 'react';
import PropTypes from 'prop-types';
import { MobileWrapper, Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const AccountStatistics = props => {
    return (
        <div className='statement__account-statistics'>
            <div className='statement__account-statistics-item'>
                <div className='statement__account-statistics--is-rectangle'>
                    <span className='statement__account-statistics-title'>
                        {localize('Total deposits')} <MobileWrapper> ({props.currency}) </MobileWrapper>
                    </span>
                    <span className='statement__account-statistics-amount'>
                        <Money amount={props.account_statistics.total_deposits} currency={props.currency} />
                    </span>
                </div>
            </div>
            <div className='statement__account-statistics-item statement__account-statistics-total-withdrawal'>
                <div className='statement__account-statistics--is-rectangle'>
                    <span className='statement__account-statistics-title'>
                        {localize('Total withdrawals')} <MobileWrapper> ({props.currency}) </MobileWrapper>
                    </span>
                    <span className='statement__account-statistics-amount'>
                        <Money amount={props.account_statistics.total_withdrawals} currency={props.currency} />
                    </span>
                </div>
            </div>
            <div className='statement__account-statistics-item'>
                <div className='statement__account-statistics--is-rectangle'>
                    <span className='statement__account-statistics-title'>
                        {localize('Net deposits')}{' '}
                        <MobileWrapper> ({props.account_statistics.currency}) </MobileWrapper>
                    </span>
                    <span className='statement__account-statistics-amount'>
                        <Money
                            amount={
                                props.account_statistics.total_deposits - props.account_statistics.total_withdrawals
                            }
                            currency={props.currency}
                        />
                    </span>
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
