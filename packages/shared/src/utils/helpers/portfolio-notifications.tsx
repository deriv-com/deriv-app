import React from 'react';
import { localize, Localize } from '@deriv/translations';

export const contractSold = (currency: string, sold_for: number | string, Money: React.ElementType) => ({
    key: 'contract_sold',
    header: localize('Contract sold'),
    message: (
        <Localize
            i18n_default_text='Contract was sold for <0 />.'
            components={[<Money key={sold_for} amount={sold_for} currency={currency} show_currency />]}
        />
    ),
    type: 'contract_sold',
    size: 'small',
    should_hide_close_btn: true,
    is_auto_close: true,
});

export const contractCancelled = () => ({
    key: 'contract_sold',
    header: localize('Contract cancelled'),
    message: (
        <Localize
            i18n_default_text='Contract was cancelled.'
            // components={[ <Money key={sold_for} amount={sold_for} currency={currency} /> ]}
        />
    ),
    type: 'contract_sold',
    size: 'small',
    should_hide_close_btn: true,
    is_auto_close: true,
});
