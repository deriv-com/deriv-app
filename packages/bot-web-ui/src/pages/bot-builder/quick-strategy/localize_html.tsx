import { localize } from '@deriv/translations';
import React from 'react';

export const LocalizeHTMLForSellConditions = () => {
    return (
        <div className='sell_conditions'>
            <div className='sell_conditions__take_profit'>
                <span>
                    <strong>{localize('Take Profit: ')}</strong>
                </span>
                <span>{localize('The position closes after the profit and loss crosses the take profit amount.')}</span>
            </div>
            <div className='sell_conditions__take_count'>
                <span>
                    <strong>{localize('Tick Count: ')}</strong>
                </span>
                <span>{localize('Counting the number of ticks before selling the position.')}</span>
            </div>
        </div>
    );
};
