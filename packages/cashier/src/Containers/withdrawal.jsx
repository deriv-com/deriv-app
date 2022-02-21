import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isCryptocurrency, isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import CryptoWithdrawForm from 'Components/Form/crypto-withdraw-form.jsx';
import CryptoWithdrawReceipt from 'Components/Receipt/crypto-withdraw-receipt.jsx';
import Withdraw from 'Components/withdraw.jsx';
import SendEmail from 'Components/Email/send-email.jsx';
import Error from 'Components/Error/error.jsx';
import NoBalance from 'Components/Error/no-balance.jsx';
import Virtual from 'Components/Error/virtual.jsx';
import WithdrawalLocked from 'Components/Error/withdrawal-locked.jsx';
import CashierLocked from 'Components/Error/cashier-locked.jsx';
import SideNote from 'Components/side-note.jsx';
import USDTSideNote from 'Components/usdt-side-note.jsx';
import CryptoTransactionsHistory from 'Components/Form/crypto-transactions-history';
import RecentTransaction from 'Components/recent-transaction.jsx';

const WithdrawalSideNote = ({ currency }) => {
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
    const side_note_title =
        notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />;

    return <SideNote has_bullets notes={notes} title={side_note_title} />;
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
}) => {
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
    if (is_10k_withdrawal_limit_reached === undefined) {
        return <Loading is_fullscreen />;
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
    if (!+balance) {
        return <NoBalance />;
    }
    if (error.message) {
        return <Error error={error} />;
    }
    if (verify_error.message) {
        return <Error error={verify_error} />;
    }
    if (!is_crypto && (verification_code || iframe_url)) {
        return <Withdraw />;
    }
    if (verification_code && is_crypto && !is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return <CryptoWithdrawForm />;
    }
    if (is_withdraw_confirmed && !is_crypto_transactions_visible) {
        return <CryptoWithdrawReceipt />;
    }
    if (is_crypto_transactions_visible) {
        return <CryptoTransactionsHistory />;
    }
    return <SendEmail />;
};

Withdrawal.propTypes = {
    balance: PropTypes.string,
    container: PropTypes.string,
    crypto_transactions: PropTypes.array,
    current_currency_type: PropTypes.string,
    error: PropTypes.object,
    iframe_url: PropTypes.string,
    is_cashier_locked: PropTypes.bool,
    is_crypto: PropTypes.bool,
    is_crypto_transactions_visible: PropTypes.bool,
    is_switching: PropTypes.bool,
    is_system_maintenance: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_withdraw_confirmed: PropTypes.bool,
    is_withdrawal_locked: PropTypes.bool,
    recentTransactionOnMount: PropTypes.func,
    setActiveTab: PropTypes.func,
    tab_index: PropTypes.number,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
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
