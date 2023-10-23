import React from 'react';
import { Loading } from '@deriv/components';
import { WS } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import Error from '../../components/error';
import NoBalance from '../../components/no-balance';
import { Virtual } from '../../components/cashier-container';
import CashierLocked from '../../components/cashier-locked';
import AccountTransferForm from './account-transfer-form';
import AccountTransferNoAccount from './account-transfer-no-account';
import AccountTransferLocked from './account-transfer-locked';
import { useCashierStore } from '../../stores/useCashierStores';
import { useCashierLocked } from '@deriv/hooks';

type TAccountTransferProps = {
    onClickDeposit?: VoidFunction;
    onClickNotes?: VoidFunction;
    onClose: VoidFunction;
    openAccountSwitcherModal?: VoidFunction;
    setSideNotes?: (notes: React.ReactNode[]) => void;
};

const AccountTransfer = observer(({ onClickDeposit, onClickNotes, onClose, setSideNotes }: TAccountTransferProps) => {
    const { client } = useStore();
    const { account_transfer, general_store } = useCashierStore();

    const {
        accounts_list,
        error,
        has_no_account,
        has_no_accounts_balance,
        is_transfer_locked,
        onMountAccountTransfer: onMount,
        setAccountTransferAmount,
        setIsTransferConfirm,
    } = account_transfer;
    const { is_loading } = general_store;
    const is_cashier_locked = useCashierLocked();
    const { is_switching, is_virtual } = client;
    const [is_loading_status, setIsLoadingStatus] = React.useState(true);

    React.useEffect(() => {
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
        if (has_no_accounts_balance || is_switching) {
            setSideNotes?.([]);
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
        return <NoBalance onClickDeposit={onClickDeposit} />;
    }

    return (
        <AccountTransferForm
            onClose={onClose}
            error={error}
            setSideNotes={setSideNotes}
            onClickDeposit={onClickDeposit}
            onClickNotes={onClickNotes}
        />
    );
});

export default AccountTransfer;
