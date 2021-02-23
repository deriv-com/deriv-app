import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { isCryptocurrency, isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import Withdraw from '../Components/withdraw.jsx';
import SendEmail from '../Components/Email/send-email.jsx';
import Error from '../Components/Error/error.jsx';
import NoBalance from '../Components/Error/no-balance.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import WithdrawalLocked from '../Components/Error/withdrawal-locked.jsx';
import CashierLocked from '../Components/Error/cashier-locked.jsx';
import SideNote from '../Components/side-note.jsx';
import USDTSideNote from '../Components/usdt-side-note.jsx';

const WithdrawalSideNote = () => {
    const notes = [
        <Localize
            i18n_default_text='Do not enter an address linked to an ICO purchase or crowdsale. If you do, the ICO tokens will not be credited into your account.'
            key={0}
        />,
        /*
        <Localize
            i18n_default_text='Each transaction will be confirmed once we receive three confirmations from the blockchain.'
            key={1}
        />,
        <Localize
            i18n_default_text='To view confirmed transactions, kindly visit the <0>statement page</0>'
            key={3}
            components={[<Link to='/reports/statement' key={0} className='link link--orange' />]}
        />,
        */
    ];

    return <SideNote has_bullets notes={notes} title={<Localize i18n_default_text='Notes' />} />;
};

const Withdrawal = ({
    balance,
    container,
    currency,
    error,
    verify_error,
    iframe_url,
    is_cashier_locked,
    is_virtual,
    is_withdrawal_locked,
    setActiveTab,
    setErrorMessage,
    setSideNotes,
    verification_code,
}) => {
    React.useEffect(() => {
        setActiveTab(container);
        return () => {
            setErrorMessage('');
        };
    }, [container, setActiveTab, setErrorMessage]);

    React.useEffect(() => {
        if ((iframe_url || verification_code) && isDesktop()) {
            if (isCryptocurrency(currency) && typeof setSideNotes === 'function') {
                const side_notes = [
                    <WithdrawalSideNote key={0} />,
                    ...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []),
                    ...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []),
                ];
                setSideNotes(side_notes);
            } else setSideNotes(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, iframe_url, verification_code]);

    if (verification_code || iframe_url) {
        return <Withdraw />;
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
    return <SendEmail />;
};

Withdrawal.propTypes = {
    balance: PropTypes.string,
    container: PropTypes.string,
    error: PropTypes.object,
    iframe_url: PropTypes.string,
    is_virtual: PropTypes.bool,
    is_cashier_locked: PropTypes.bool,
    is_withdrawal_locked: PropTypes.bool,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    currency: client.currency,
    is_virtual: client.is_virtual,
    verification_code: client.verification_code.payment_withdraw,
    container: modules.cashier.config.withdraw.container,
    error: modules.cashier.config.withdraw.error,
    verify_error: modules.cashier.config.withdraw.verification.error,
    iframe_url: modules.cashier.config.withdraw.iframe_url,
    is_cashier_locked: modules.cashier.is_cashier_locked,
    is_withdrawal_locked: modules.cashier.is_withdrawal_locked,
    setActiveTab: modules.cashier.setActiveTab,
    setErrorMessage: modules.cashier.setErrorMessage,
}))(Withdrawal);
