import { Localize, localize } from '@deriv/translations';
import React from 'react';

export const LocalizeHTMLForSellConditions = additional_data => {
    const { max_payout, max_ticks } = additional_data ?? {
        max_payout: 0,
        max_ticks: 0,
    };

    return (
        <div className='sell_conditions'>
            <div className='sell_conditions__take_profit'>
                <span>
                    <strong>{localize('Take Profit: ')}</strong>
                </span>
                <span>{localize('The position closes after the profit and loss crosses the take profit amount.')}</span>
            </div>
            <div className='sell_conditions__tick_count'>
                <span>
                    <strong>{localize('Tick Count: ')}</strong>
                </span>
                <span>{localize('Counting the number of ticks before selling the position.')}</span>
            </div>
            <div>
                <Localize
                    i18n_default_text='The position closes when the input condition is met or upon reaching the maximum payout of {{ max_payout }} or maximum tick of {{ max_ticks }}, whichever occurs first.'
                    values={{
                        max_payout,
                        max_ticks,
                    }}
                />
            </div>
        </div>
    );
};
