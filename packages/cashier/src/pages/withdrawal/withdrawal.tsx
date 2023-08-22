import React from 'react';
import { Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isCryptocurrency, isDesktop } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import CryptoTransactionsHistory from '../../components/crypto-transactions-history';
import CryptoWithdrawal from './crypto-withdrawal';
import CryptoWithdrawReceipt from './crypto-withdraw-receipt';
import Withdraw from './withdraw';
import WithdrawalLocked from './withdrawal-locked';
import WithdrawalVerificationEmail from './withdrawal-verification-email';
import CashierLocked from '../../components/cashier-locked';
import Error from '../../components/error';
import NoBalance from '../../components/no-balance';
import RecentTransaction from '../../components/recent-transaction';
import SideNote from '../../components/side-note';
import USDTSideNote from '../../components/usdt-side-note';
import { Virtual } from '../../components/cashier-container';
import { useCashierStore } from '../../stores/useCashierStores';
import { useCashierLocked, useIsSystemMaintenance } from '@deriv/hooks';

type TWithdrawalSideNoteProps = {
    is_mobile?: boolean;
};

type TWithdrawalProps = {
    setSideNotes: (notes: React.ReactNode[]) => void;
};

const WithdrawalSideNote = ({ is_mobile }: TWithdrawalSideNoteProps) => {
    const notes = [
        <Localize i18n_default_text="We'll send you an email once your transaction has been processed." key={1} />,
    ];

    return <SideNote has_bullets is_mobile={is_mobile} side_notes={notes} className='outside-wrapper' />;
};

const Withdrawal = observer(({ setSideNotes }: TWithdrawalProps) => {
    const { client } = useStore();
    const {
        balance,
        currency,
        current_currency_type,
        is_switching,
        is_virtual,
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { iframe, general_store, transaction_history, withdraw } = useCashierStore();
    const { is_crypto, cashier_route_tab_index: tab_index } = general_store;
    const is_cashier_locked = useCashierLocked();
    const is_system_maintenance = useIsSystemMaintenance();
    const { iframe_url } = iframe;
    const { is_crypto_transactions_visible } = transaction_history;
    const {
        check10kLimit,
        error,
        is_10k_withdrawal_limit_reached,
        is_withdraw_confirmed,
        is_withdrawal_locked,
        error: { setErrorMessage },
        willMountWithdraw,
    } = withdraw;

    React.useEffect(() => {
        return () => {
            setErrorMessage({ code: '', message: '' });
        };
    }, [setErrorMessage]);

    React.useEffect(() => {
        check10kLimit();
    }, [check10kLimit]);

    React.useEffect(() => {
        return () => willMountWithdraw(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [willMountWithdraw]);

    React.useEffect(() => {
        if (isDesktop()) {
            if (isCryptocurrency(currency) && !is_switching) {
                const side_notes = [];
                if (verification_code || is_withdraw_confirmed) {
                    side_notes.push(<RecentTransaction key={2} />);
                }
                side_notes.push(...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []));
                side_notes.push(...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []));

                setSideNotes?.([
                    ...side_notes.map((side_note, index) => (
                        <SideNote has_title={false} key={index}>
                            {side_note}
                        </SideNote>
                    )),
                ]);
            } else setSideNotes?.([]);
        }

        return () => {
            setSideNotes?.([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, tab_index]);

    // TODO: Fix if conditions, use else if and combine conditions when possible
    if (is_system_maintenance) {
        if (is_cashier_locked || (is_withdrawal_locked && current_currency_type === 'crypto')) {
            return <CashierLocked />;
        }
    }

    if (is_switching || is_10k_withdrawal_limit_reached === undefined) {
        return <Loading is_fullscreen={false} />;
    }

    if (is_virtual) {
        return <Virtual />;
    }

    if (is_cashier_locked) {
        return <CashierLocked />;
    }

    if (is_withdrawal_locked || is_10k_withdrawal_limit_reached) {
        return <WithdrawalLocked />;
    }

    if (!Number(balance)) {
        return (
            <>
                <NoBalance />
                {!isCryptocurrency(currency) && <WithdrawalSideNote is_mobile />}
            </>
        );
    }

    if (error.is_show_full_page && error.message) {
        return <Error error={error} />;
    }

    if (!is_crypto && (verification_code || iframe_url)) {
        return <Withdraw />;
    }

    if (verification_code && is_crypto && !is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return <CryptoWithdrawal />;
    }

    if (is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return <CryptoWithdrawReceipt />;
    }

    if (is_crypto_transactions_visible) {
        return <CryptoTransactionsHistory />;
    }

    return (
        <>
            <WithdrawalVerificationEmail />
            {!isCryptocurrency(currency) && <WithdrawalSideNote is_mobile />}
        </>
    );
});

export default Withdrawal;
