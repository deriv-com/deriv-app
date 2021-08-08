import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isCryptocurrency, isDesktop, isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import CryptoWithdrawForm from '../Components/Form/crypto-withdraw-form.jsx';
import CryptoWithdrawReceipt from '../Components/Receipt/crypto-withdraw-receipt.jsx';
import Withdraw from '../Components/withdraw.jsx';
import SendEmail from '../Components/Email/send-email.jsx';
import Error from '../Components/Error/error.jsx';
import NoBalance from '../Components/Error/no-balance.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import WithdrawalLocked from '../Components/Error/withdrawal-locked.jsx';
import CashierLocked from '../Components/Error/cashier-locked.jsx';
import SideNote from '../Components/side-note.jsx';
import USDTSideNote from '../Components/usdt-side-note.jsx';
import RecentTransaction from '../Components/recent-transaction.jsx';

const WithdrawalSideNote = ({ has_invalid_crypto_address }) => {
    const notes = [
        <Localize
            i18n_default_text='Do not enter an address linked to an ICO purchase or crowdsale. If you do, the ICO tokens will not be credited into your account.'
            key={0}
        />,
        <Localize i18n_default_text="We'll send you an email once your transaction has been processed." key={1} />,
    ];
    if (has_invalid_crypto_address) {
        notes.push(
            <Localize
                i18n_default_text='An invalid wallet address could mean that the entered address is currently processing for a previous transaction. Please wait for 
        the existing transaction to be completed or provide a new address.'
                key={2}
            />
        );
    }
    const side_note_title =
        notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />;

    return <SideNote has_bullets notes={notes} title={side_note_title} />;
};

const Withdrawal = ({
    balance,
    container,
    crypto_transactions,
    currency,
    error,
    check10kLimit,
    has_invalid_crypto_address,
    iframe_url,
    is_10k_withdrawal_limit_reached,
    is_cashier_locked,
    is_crypto,
    is_virtual,
    is_withdraw_confirmed,
    is_withdrawal_locked,
    setActiveTab,
    setErrorMessage,
    setSideNotes,
    verify_error,
    verification_code,
    is_system_maintenance,
    current_currency_type,
}) => {
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
        if (verification_code && isDesktop()) {
            if (isCryptocurrency(currency) && typeof setSideNotes === 'function') {
                const side_notes = [];
                if (crypto_transactions.lenght) {
                    side_notes.push(<RecentTransaction key={2} />);
                } else {
                    const side_note = [
                        <WithdrawalSideNote key={0} has_invalid_crypto_address={has_invalid_crypto_address} />,
                        ...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []),
                        ...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []),
                    ];
                    side_notes.push(side_note);
                }
                setSideNotes(side_notes);
            } else setSideNotes(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, has_invalid_crypto_address, verification_code]);

    if (is_system_maintenance) {
        if (is_cashier_locked || (is_withdrawal_locked && current_currency_type === 'crypto')) {
            return <CashierLocked />;
        }
    }
    if (is_10k_withdrawal_limit_reached === undefined) {
        return <Loading is_fullscreen />;
    }
    if (is_10k_withdrawal_limit_reached) {
        return <WithdrawalLocked is_10K_limit />;
    }
    if (!is_crypto && (verification_code || iframe_url)) {
        return <Withdraw />;
    }
    if (verification_code && is_crypto) {
        return <CryptoWithdrawForm />;
    }
    if (is_withdraw_confirmed) {
        return <CryptoWithdrawReceipt />;
    }
    if (is_virtual) {
        return <Virtual />;
    }
    if (!+balance) {
        return <NoBalance />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    if (is_withdrawal_locked) {
        return <WithdrawalLocked />;
    }
    if (error.message) {
        return <Error error={error} container='withdraw' />;
    }
    if (verify_error.message) {
        return <Error error={verify_error} container='withdraw' />;
    }
    return (
        <React.Fragment>
            <SendEmail />
            {isMobile() && is_crypto && crypto_transactions.length && <RecentTransaction />}
        </React.Fragment>
    );
};

Withdrawal.propTypes = {
    balance: PropTypes.string,
    container: PropTypes.string,
    crypto_transactions: PropTypes.array,
    error: PropTypes.object,
    has_invalid_crypto_address: PropTypes.bool,
    iframe_url: PropTypes.string,
    is_virtual: PropTypes.bool,
    is_cashier_locked: PropTypes.bool,
    is_crypto: PropTypes.bool,
    is_withdraw_confirmed: PropTypes.bool,
    is_withdrawal_locked: PropTypes.bool,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
    is_system_maintenance: PropTypes.bool,
    current_currency_type: PropTypes.bool,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    check10kLimit: modules.cashier.check10kLimit,
    container: modules.cashier.config.withdraw.container,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    error: modules.cashier.config.withdraw.error,
    has_invalid_crypto_address: modules.cashier.config.withdraw.has_invalid_crypto_address,
    iframe_url: modules.cashier.config.withdraw.iframe_url,
    is_10k_withdrawal_limit_reached: modules.cashier.is_10k_withdrawal_limit_reached,
    is_cashier_locked: modules.cashier.is_cashier_locked,
    is_crypto: modules.cashier.is_crypto,
    is_virtual: client.is_virtual,
    is_withdraw_confirmed: modules.cashier.config.withdraw.is_withdraw_confirmed,
    is_withdrawal_locked: modules.cashier.is_withdrawal_locked,
    verification_code: client.verification_code.payment_withdraw,
    verify_error: modules.cashier.config.withdraw.verification.error,
    setActiveTab: modules.cashier.setActiveTab,
    setErrorMessage: modules.cashier.setErrorMessage,
    is_system_maintenance: modules.cashier.is_system_maintenance,
    current_currency_type: client.current_currency_type,
}))(Withdrawal);
