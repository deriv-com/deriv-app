import React from 'react';
import { isCryptocurrency } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Dialog } from '@deriv/components';
import { connect } from 'Stores/connect';

type AccountPromptDialogProps = {
    accounts_list: unknown;
    continueRoute: () => void;
    is_confirmed: boolean;
    last_location: string;
    onCancel: () => void;
    onConfirm: () => void;
    should_show: boolean;
};

const AccountPromptDialog = ({
    accounts_list,
    continueRoute,
    currency,
    is_confirmed,
    last_location,
    onCancel,
    onConfirm,
    should_show,
}: AccountPromptDialogProps) => {
    React.useEffect(continueRoute, [is_confirmed, last_location, continueRoute]);

    const non_crypto_accounts = accounts_list.filter(x => !x.is_crypto);
    const non_crypto_currency = non_crypto_accounts.map(x => x.currency)[0];
    const is_crypto = !!currency && isCryptocurrency(currency);

    return (
        <Dialog
            className='acc-prompt-dialog'
            title={is_crypto ? localize('Switch account?') : localize('Switch to crypto account?')}
            confirm_button_text={is_crypto ? localize('Switch account') : localize('Switch to crypto account')}
            cancel_button_text={localize('Cancel')}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_visible={should_show}
        >
            {is_crypto ? (
                <Localize
                    i18n_default_text='To deposit money, please switch to your {{currency_symbol}} account.'
                    values={{
                        currency_symbol: non_crypto_currency?.toUpperCase(),
                    }}
                />
            ) : (
                <Localize i18n_default_text='To deposit cryptocurrency, switch your account.' />
            )}
        </Dialog>
    );
};

export default connect(({ client, modules }) => ({
    accounts_list: modules.cashier.account_transfer.accounts_list,
    continueRoute: modules.cashier.account_prompt_dialog.continueRoute,
    currency: client.currency,
    is_confirmed: modules.cashier.account_prompt_dialog.is_confirmed,
    last_location: modules.cashier.account_prompt_dialog.last_location,
    onCancel: modules.cashier.account_prompt_dialog.onCancel,
    onConfirm: modules.cashier.account_prompt_dialog.onConfirm,
    should_show: modules.cashier.account_prompt_dialog.should_show,
}))(AccountPromptDialog);
