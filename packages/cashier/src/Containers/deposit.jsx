import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { isCryptocurrency, isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import CashierContainer from '../Components/cashier-container.jsx';
import Error from '../Components/Error/error.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import CashierLocked from '../Components/Error/cashier-locked.jsx';
import DepositsLocked from '../Components/Error/deposit-locked.jsx';
import FundsProtection from '../Components/Error/funds-protection.jsx';
import MaxTurnover from '../Components/Form/max-turnover-form.jsx';
import SideNote from '../Components/side-note.jsx';
import USDTSideNote from '../Components/usdt-side-note.jsx';

const DepositeSideNote = () => {
    const notes = [
        <Localize i18n_default_text='This address can only be used once to make a deposit.' key={0} />,
        /*
        <Localize
            i18n_default_text='For each deposit you will have to visit here again to generate a new address.'
            key={1}
        />,
        <Localize
            i18n_default_text='Each transaction will be confirmed once we receive three confirmations from the blockchain.'
            key={3}
        />,
        <Localize
            i18n_default_text='To view confirmed transactions, kindly visit the <0>statement page</0>'
            key={4}
            components={[<Link to='/reports/statement' key={0} className='link link--orange' />]}
        />,
        */
    ];

    return <SideNote has_bullets notes={notes} title={<Localize i18n_default_text='Notes' />} />;
};

const Deposit = ({
    is_cashier_locked,
    is_deposit_locked,
    is_virtual,
    error,
    iframe_height,
    iframe_url,
    setActiveTab,
    onMount,
    container,
    currency,
    is_loading,
    setSideNotes,
}) => {
    React.useEffect(() => {
        setActiveTab(container);
        onMount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (iframe_height && isDesktop()) {
            if (isCryptocurrency(currency) && typeof setSideNotes === 'function') {
                const side_notes = [
                    <DepositeSideNote key={0} />,
                    ...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []),
                    ...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []),
                ];
                setSideNotes(side_notes);
            } else setSideNotes(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, iframe_height]);

    if (is_virtual) {
        return <Virtual />;
    }
    if (error.is_ask_uk_funds_protection) {
        return <FundsProtection />;
    }
    if (error.is_self_exclusion_max_turnover_set) {
        return <MaxTurnover />;
    }
    if (is_deposit_locked) {
        return <DepositsLocked />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    if (error.message) {
        return <Error error={error} />;
    }
    return <CashierContainer iframe_height={iframe_height} iframe_url={iframe_url} is_loading={is_loading} />;
};

Deposit.propTypes = {
    container: PropTypes.string,
    error: PropTypes.object,
    is_cashier_locked: PropTypes.bool,
    is_deposit_locked: PropTypes.bool,
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    is_loading: PropTypes.bool,
    is_virtual: PropTypes.bool,
    onMount: PropTypes.func,
    setActiveTab: PropTypes.func,
    setSideNotes: PropTypes.func,
    standpoint: PropTypes.object,
};

export default connect(({ client, modules }) => ({
    is_cashier_locked: modules.cashier.is_cashier_locked,
    is_deposit_locked: modules.cashier.is_deposit_locked,
    is_virtual: client.is_virtual,
    container: modules.cashier.config.deposit.container,
    currency: client.currency,
    error: modules.cashier.config.deposit.error,
    iframe_height: modules.cashier.config.deposit.iframe_height,
    iframe_url: modules.cashier.config.deposit.iframe_url,
    is_loading: modules.cashier.is_loading,
    onMount: modules.cashier.onMount,
    setActiveTab: modules.cashier.setActiveTab,
    standpoint: client.standpoint,
}))(Deposit);
