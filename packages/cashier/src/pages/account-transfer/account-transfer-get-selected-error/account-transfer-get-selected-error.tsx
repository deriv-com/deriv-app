import React from 'react';
import { Localize } from '@deriv/translations';

const AccountTransferGetSelectedError = (selected_value?: string, is_from_account = false) => {
    if (is_from_account) {
        return (
            <Localize
                i18n_default_text='Transfer from {{selected_value}} is not allowed, Please choose another account from dropdown'
                values={{ selected_value }}
            />
        );
    }

    return (
        <Localize
            i18n_default_text='Transfer to {{selected_value}} is not allowed, Please choose another account from dropdown'
            values={{ selected_value }}
        />
    );
};

export default AccountTransferGetSelectedError;
