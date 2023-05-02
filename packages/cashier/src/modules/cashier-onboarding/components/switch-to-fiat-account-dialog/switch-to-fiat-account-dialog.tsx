import React from 'react';
import { Dialog } from '@deriv/components';
import { useFiatAccountList } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

type TProps = {
    is_visible: boolean;
    onCancel: VoidFunction;
    onSwitchDone: VoidFunction;
};

const SwitchToFiatAccountDialog: React.FC<TProps> = observer(({ is_visible = false, onCancel, onSwitchDone }) => {
    const { client } = useStore();
    const { switchAccount } = client;
    const fiat_account_list = useFiatAccountList();
    const fiat_account_loginid = fiat_account_list?.[0].loginid;
    const fiat_account_currency = fiat_account_list?.[0].title;

    const onConfirm = async () => {
        await switchAccount(fiat_account_loginid);

        onSwitchDone();
    };

    return (
        <Dialog
            title={localize('Switch account?')}
            confirm_button_text={localize('Switch account')}
            cancel_button_text={localize('Cancel')}
            onConfirm={onConfirm}
            onCancel={onCancel}
            is_visible={is_visible}
            dismissable={false}
            has_close_icon={false}
            portal_element_id='modal_root'
        >
            <Localize
                i18n_default_text='To deposit money, please switch to your {{currency_symbol}} account.'
                values={{ currency_symbol: fiat_account_currency?.toUpperCase() }}
            />
        </Dialog>
    );
});

export default SwitchToFiatAccountDialog;
