import React from 'react';
import { observer } from 'mobx-react-lite';
import { CurrencySelector } from '@deriv/account';
import { useStores } from 'Stores';

const CurrencySelectorForm: React.FC = props => {
    const { client_store, ui_store } = useStores();
    const {
        currencies_list,
        currency,
        has_active_real_account,
        upgradeable_currencies,
        has_wallet_account,
    } = client_store;
    const { real_account_signup, resetRealAccountSignupParams } = ui_store;

    return (
        <CurrencySelector
            {...props}
            currencies={currencies_list}
            has_currency={!!currency}
            has_real_account={has_active_real_account}
            legal_allowed_currencies={upgradeable_currencies}
            real_account_signup={real_account_signup}
            resetRealAccountSignupParams={resetRealAccountSignupParams}
            has_wallet_account={has_wallet_account}
            has_cancel
        />
    );
};

export default observer(CurrencySelectorForm);
