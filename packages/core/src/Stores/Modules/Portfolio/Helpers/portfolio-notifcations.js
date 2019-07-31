import React        from 'react';
import { localize } from 'App/i18n';
import Money        from '../../../../App/Components/Components/money.jsx';
import Localize     from '../../../../App/Components/Components/localize.jsx';

export const contractSold = (currency, sold_for) => ({
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
