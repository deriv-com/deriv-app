import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { TRootStore, TClientStore, TAccountsList, TSideNotesProps } from 'Types';
import Error from 'Components/error';
import NoBalance from 'Components/no-balance';
import { Virtual } from 'Components/cashier-container';
import CashierLocked from 'Components/cashier-locked';
import CryptoTransactionsHistory from 'Components/crypto-transactions-history';
import AccountTransferReceipt from './account-transfer-receipt';
import AccountTransferForm from './account-transfer-form';
import AccountTransferNoAccount from './account-transfer-no-account';
import AccountTransferLocked from './account-transfer-locked';

type TAccountTransferProps = {
    accounts_list: Array<TAccountsList>;
    container: string;
    error: {
        is_show_full_page: boolean;
        message: string;
    };
    has_no_account: boolean;
    has_no_accounts_balance: boolean;
    is_cashier_locked: boolean;
    is_crypto_transactions_visible: boolean;
    is_loading: boolean;
    is_switching: TClientStore['is_switching'];
    is_transfer_confirm: boolean;
    is_transfer_locked: boolean;
    is_virtual: TClientStore['is_virtual'];
    onMount: () => void;
    recentTransactionOnMount: () => void;
    setAccountTransferAmount: (amount: number | string) => void;
    setActiveTab: (container: string) => void;
    setIsTransferConfirm: (status: boolean) => void;
    setSideNotes: (notes: TSideNotesProps) => void;
};

const AccountTransfer = ({
    accounts_list,
    container,
    error,
    has_no_account,
    has_no_accounts_balance,
    is_cashier_locked,
    is_crypto_transactions_visible,
    is_loading,
    is_switching,
    is_transfer_confirm,
    is_transfer_locked,
    is_virtual,
    onMount,
    recentTransactionOnMount,
    setAccountTransferAmount,
    setActiveTab,
    setIsTransferConfirm,
    setSideNotes,
}: TAccountTransferProps) => {
    const [is_loading_status, setIsLoadingStatus] = React.useState(true);

    React.useEffect(() => {
        if (!is_crypto_transactions_visible) {
            recentTransactionOnMount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    React.useEffect(() => {
        setActiveTab(container);
        onMount();

        WS.wait('authorize', 'website_status', 'get_settings', 'paymentagent_list').then(() => {
            setIsLoadingStatus(false);
        });

        return () => {
            setAccountTransferAmount('');
            setIsTransferConfirm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (typeof setSideNotes === 'function' && (has_no_accounts_balance || is_switching)) {
            setSideNotes(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSideNotes, has_no_accounts_balance]);

    if (is_virtual) {
        return <Virtual />;
    }
    if (is_loading || is_switching || is_loading_status) {
        return <Loading className='cashier__loader' is_fullscreen={false} />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    if (is_transfer_locked) {
        return <AccountTransferLocked />;
    }
    if (error.is_show_full_page || (error.message && !accounts_list.length)) {
        // for errors with CTA hide the form and show the error,
        // for others show them at the bottom of the form next to submit button
        return <Error error={error} />;
    }
    if (has_no_account) {
        return <AccountTransferNoAccount />;
    }
    if (has_no_accounts_balance) {
        return <NoBalance />;
    }
    if (is_transfer_confirm) {
        return <AccountTransferReceipt />;
    }
    if (is_crypto_transactions_visible) {
        return <CryptoTransactionsHistory />;
    }

    return <AccountTransferForm error={error} setSideNotes={setSideNotes} />;
};

export default connect(({ client, modules }: TRootStore) => ({
    accounts_list: modules.cashier.account_transfer.accounts_list,
    container: modules.cashier.account_transfer.container,
    error: modules.cashier.account_transfer.error,
    has_no_account: modules.cashier.account_transfer.has_no_account,
    has_no_accounts_balance: modules.cashier.account_transfer.has_no_accounts_balance,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_crypto_transactions_visible: modules.cashier.transaction_history.is_crypto_transactions_visible,
    is_loading: modules.cashier.general_store.is_loading,
    is_switching: client.is_switching,
    is_transfer_confirm: modules.cashier.account_transfer.is_transfer_confirm,
    is_transfer_locked: modules.cashier.general_store.is_transfer_locked,
    is_virtual: client.is_virtual,
    onMount: modules.cashier.account_transfer.onMountAccountTransfer,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    setAccountTransferAmount: modules.cashier.account_transfer.setAccountTransferAmount,
    setActiveTab: modules.cashier.general_store.setActiveTab,
    setIsTransferConfirm: modules.cashier.account_transfer.setIsTransferConfirm,
}))(AccountTransfer);
