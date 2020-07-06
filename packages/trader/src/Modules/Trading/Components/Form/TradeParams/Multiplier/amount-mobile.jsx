import React from 'react';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';

const Amount = ({ amount, currency, multiplier }) => {
    return (
        <div className='mobile-widget mobile-widget__multiplier-amount'>
            <div className='mobile-widget__item'>
                <span className='mobile-widget__item-label'>{localize('Stake')}</span>
                <span className='mobile-widget__item-value'>
                    <Money amount={amount} currency={currency} />
                </span>
            </div>
            <div className='mobile-widget__item'>
                <span className='mobile-widget__item-label'>{localize('Multiplier')}</span>
                <span className='mobile-widget__item-value'>x{multiplier}</span>
            </div>
        </div>
    );
};

export default connect(({ modules }) => ({
    amount: modules.trade.amount,
    currency: modules.trade.currency,
    multiplier: modules.trade.multiplier,
}))(Amount);
