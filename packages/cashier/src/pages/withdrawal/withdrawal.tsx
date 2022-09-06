import React from 'react';
import { Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isCryptocurrency, isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { TClientStore, TCryptoTransactionDetails, TRootStore } from 'Types';
import CryptoTransactionsHistory from 'Components/crypto-transactions-history';
import CryptoWithdrawForm from './crypto-withdraw-form';
import CryptoWithdrawReceipt from './crypto-withdraw-receipt';
import Withdraw from './withdraw';
import WithdrawalLocked from './withdrawal-locked';
import WithdrawalVerificationEmail from './withdrawal-verification-email';
import CashierLocked from 'Components/cashier-locked';
import Error from 'Components/error';
import NoBalance from 'Components/no-balance';
import RecentTransaction from 'Components/recent-transaction';
import SideNote from 'Components/side-note';
import USDTSideNote from 'Components/usdt-side-note';
import { Virtual } from 'Components/cashier-container';

type TErrorFull = {
    code?: string;
    fields?: string;
    is_ask_authentication: boolean;
    is_ask_financial_risk_approval: boolean;
    is_ask_uk_funds_protection: boolean;
    is_self_exclusion_max_turnover_set: boolean;
    is_show_full_page: boolean | null;
    message?: string;
    onClickButton?: () => void | null;
};

type TErrorShort = {
    code: string;
    message: string;
};

type TWithdrawalSideNoteProps = {
    currency: string;
    is_mobile?: boolean;
};

type TWithdrawalProps = {
    balance: TClientStore['balance'];
    container: string;
    crypto_transactions: TCryptoTransactionDetails[];
    current_currency_type: TClientStore['current_currency_type'];
    currency: TClientStore['currency'];
    error: TErrorFull;
    iframe_url: string;
    is_10k_withdrawal_limit_reached: boolean;
    is_cashier_locked: boolean;
    is_crypto: boolean;
    is_crypto_transactions_visible: boolean;
    is_switching: TClientStore['is_switching'];
    is_system_maintenance: boolean;
    is_virtual: TClientStore['is_virtual'];
    is_withdraw_confirmed: boolean;
    is_withdrawal_locked: boolean;
    tab_index: number;
    verification_code: TClientStore['verification_code']['payment_withdraw'];
    verify_error: TErrorFull;
    check10kLimit: () => void;
    setActiveTab: (container: string) => void;
    setErrorMessage: (
        error: TErrorShort | string,
        onClickButton?: () => void | null,
        is_show_full_page?: boolean | null
    ) => void;
    setSideNotes: (notes: (JSX.Element | JSX.Element[])[] | null) => void;
    willMountWithdraw: (verification_code: TClientStore['verification_code']['payment_withdraw']) => void;
    recentTransactionOnMount: () => void;
};

const WithdrawalSideNote = ({ is_mobile, currency }: TWithdrawalSideNoteProps) => {
    const notes = [
        <Localize
            i18n_default_text='Do not enter an address linked to an ICO purchase or crowdsale. If you do, the ICO tokens will not be credited into your account.'
            key={0}
        />,
        <Localize
            i18n_default_text='Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to the high volatility of cryptocurrency.'
            key={1}
        />,
    ];

    if (!isCryptocurrency(currency)) {
        notes.push(
            <Localize i18n_default_text="We'll send you an email once your transaction has been processed." key={1} />
        );
    }

    return <SideNote has_bullets is_mobile={is_mobile} side_notes={notes} className='outside-wrapper' />;
};

const Withdrawal = ({
    balance,
    check10kLimit,
    container,
    crypto_transactions,
    currency,
    current_currency_type,
    error,
    iframe_url,
    is_10k_withdrawal_limit_reached,
    is_cashier_locked,
    is_crypto,
    is_crypto_transactions_visible,
    is_switching,
    is_system_maintenance,
    is_virtual,
    is_withdraw_confirmed,
    is_withdrawal_locked,
    setActiveTab,
    setErrorMessage,
    setSideNotes,
    tab_index,
    verify_error,
    verification_code,
    willMountWithdraw,
    recentTransactionOnMount,
}: TWithdrawalProps) => {
    React.useEffect(() => {
        if (!is_crypto_transactions_visible) {
            recentTransactionOnMount();
        }
    }, [is_crypto_transactions_visible, is_switching, recentTransactionOnMount]);

    React.useEffect(() => {
        setActiveTab(container);
        return () => {
            setErrorMessage('');
        };
    }, [container, setActiveTab, setErrorMessage]);

    React.useEffect(() => {
        check10kLimit();
    }, [check10kLimit]);

    React.useEffect(() => {
        return () => willMountWithdraw(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [willMountWithdraw]);

    React.useEffect(() => {
        if (isDesktop()) {
            if (isCryptocurrency(currency) && typeof setSideNotes === 'function' && !is_switching) {
                const side_notes = [];
                if (crypto_transactions?.length) {
                    side_notes.push(<RecentTransaction key={2} />);
                }
                const side_note = [
                    <WithdrawalSideNote currency={currency} key={0} />,
                    ...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []),
                    ...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []),
                ];
                side_notes.push(side_note);
                setSideNotes(side_notes);
            } else setSideNotes(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, tab_index, crypto_transactions]);

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
                {is_crypto && <WithdrawalSideNote currency={currency} is_mobile />}
            </>
        );
    }
    if (error.is_show_full_page && error.message) {
        return <Error error={error} />;
    }
    if (verify_error.message) {
        return <Error error={verify_error} />;
    }
    if (!is_crypto && (verification_code || iframe_url)) {
        return <Withdraw />;
    }
    if (verification_code && is_crypto && !is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return (
            <>
                <CryptoWithdrawForm />
                {is_crypto && <WithdrawalSideNote currency={currency} is_mobile />}
            </>
        );
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
            {is_crypto && <WithdrawalSideNote currency={currency} is_mobile />}
        </>
    );
};

export default connect(({ client, modules }: TRootStore) => ({
    balance: client.balance,
    check10kLimit: modules.cashier.withdraw.check10kLimit,
    container: modules.cashier.withdraw.container,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    current_currency_type: client.current_currency_type,
    error: modules.cashier.withdraw.error,
    iframe_url: modules.cashier.iframe.iframe_url,
    is_10k_withdrawal_limit_reached: modules.cashier.withdraw.is_10k_withdrawal_limit_reached,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_crypto: modules.cashier.general_store.is_crypto,
    is_crypto_transactions_visible: modules.cashier.transaction_history.is_crypto_transactions_visible,
    is_switching: client.is_switching,
    is_system_maintenance: modules.cashier.general_store.is_system_maintenance,
    is_virtual: client.is_virtual,
    is_withdraw_confirmed: modules.cashier.withdraw.is_withdraw_confirmed,
    is_withdrawal_locked: modules.cashier.withdraw.is_withdrawal_locked,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    setActiveTab: modules.cashier.general_store.setActiveTab,
    setErrorMessage: modules.cashier.withdraw.error.setErrorMessage,
    tab_index: modules.cashier.general_store.cashier_route_tab_index,
    verification_code: client.verification_code.payment_withdraw,
    verify_error: modules.cashier.withdraw.verification.error,
    willMountWithdraw: modules.cashier.withdraw.willMountWithdraw,
}))(Withdrawal);
