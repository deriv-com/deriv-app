import React from 'react';
import { AmountInput, TransferAccountSelector } from '@deriv/components';
import { getDecimalPlaces } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { transfer_accounts } from './mock_accounts/mock_accounts';
import type { TAccount } from './types';
import './wallet-transfer.scss';

const Divider = () => <div className='wallet-transfer__divider' />;

const WalletTransfer = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const [from_account, setFromAccount] = React.useState<TAccount>(transfer_accounts.wallets[0]);
    const [to_account, setToAccount] = React.useState<TAccount>();
    const [from_amount, setFromAmount] = React.useState();
    const [to_amount, setToAmount] = React.useState();

    const account_list_height_with_offset = 'calc(100vh - 12.2rem)';

    const portal_id = is_mobile ? 'mobile_list_modal_root' : 'modal_root';

    const to_account_list = React.useMemo(() => {
        if (from_account?.label === 'Demo USD Wallet') {
            setToAccount(undefined);
            return { accounts: transfer_accounts.accounts, wallets: [] };
        }
        setToAccount(transfer_accounts.wallets[0]);
        return { wallets: transfer_accounts.wallets, accounts: [] };
    }, [from_account?.label]);

    const transfer_to_hint = React.useMemo(() => {
        return to_account?.label === 'Demo USD Wallet' ? (
            <Localize
                i18n_default_text='You can only transfer funds from the {{account}} to the linked {{wallet}}.'
                values={{
                    account: from_account?.label,
                    wallet: transfer_accounts.wallets[0].label,
                }}
            />
        ) : (
            ''
        );
    }, [from_account?.label, to_account?.label]);

    return (
        <div className='wallet-transfer'>
            <div className='wallet-transfer__tile'>
                <AmountInput
                    currency={from_account?.currency || ''}
                    decimal_places={from_account?.currency ? getDecimalPlaces(from_account?.currency) : 0}
                    disabled={false}
                    initial_value={from_amount}
                    label={localize('Amount you send')}
                />
                <Divider />
                <TransferAccountSelector
                    is_mobile={is_mobile}
                    label={localize('Transfer from')}
                    mobile_list_min_height={account_list_height_with_offset}
                    onSelectAccount={setFromAccount}
                    placeholder={localize('Select a trading account or a Wallet')}
                    portal_id={portal_id}
                    transfer_accounts={transfer_accounts}
                    wallet_name='Demo USD Wallet'
                    value={from_account}
                />
            </div>
            <div className='wallet-transfer__tile'>
                <AmountInput
                    currency={to_account?.currency || ''}
                    decimal_places={to_account?.currency ? getDecimalPlaces(from_account?.currency) : 0}
                    disabled={!to_account}
                    initial_value={to_amount}
                    label={localize('Amount you receive')}
                />
                <Divider />
                <TransferAccountSelector
                    is_mobile={is_mobile}
                    label={localize('Transfer to')}
                    mobile_list_min_height={account_list_height_with_offset}
                    onSelectAccount={setToAccount}
                    placeholder={!to_account ? localize('Select a trading account or a Wallet') : ''}
                    portal_id={portal_id}
                    transfer_accounts={to_account_list}
                    transfer_hint={transfer_to_hint}
                    wallet_name='Demo USD Wallet'
                    value={to_account}
                />
            </div>
        </div>
    );
});

export default WalletTransfer;
