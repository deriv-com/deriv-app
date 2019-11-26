import { Money }              from 'deriv-components';
import React                  from 'react';
import { localize, Localize } from 'deriv-translations';

export const contractSold = (currency, sold_for) => ({
    key    : 'contract_sold',
    header : localize('Contract sold'),
    message: (
        <Localize
            i18n_default_text='Contract was sold for <0 />.'
            components={[ <Money key={sold_for} amount={sold_for} currency={currency} /> ]}
        />
    ),
    type                 : 'contract_sold',
    size                 : 'small',
    should_hide_close_btn: true,
    is_auto_close        : true,
});
