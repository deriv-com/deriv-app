import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { TSideNotesProps } from 'Types';
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
    setSideNotes: (notes: TSideNotesProps) => void;
};

const AccountTransfer = observer(({ setSideNotes }: TAccountTransferProps) => {
    const {
        modules: {
            cashier: { account_transfer, general_store, transaction_history },
        },
        client,
    } = useStore();

    const {
        accounts_list,
        container,
        error,
        has_no_account,
        has_no_accounts_balance,
        is_transfer_confirm,
        is_transfer_locked,
        onMountAccountTransfer: onMount,
        setAccountTransferAmount,
        setIsTransferConfirm,
    } = account_transfer;

    const { is_cashier_locked, is_loading, setActiveTab } = general_store;

    const { is_crypto_transactions_visible, onMount: recentTransactionOnMount } = transaction_history;

    const { is_switching, is_virtual } = client;

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
});

export default AccountTransfer;
