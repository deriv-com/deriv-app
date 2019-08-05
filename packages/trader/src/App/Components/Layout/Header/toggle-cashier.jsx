import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
import { localize }       from 'App/i18n';
import { Modal }          from 'App/Components/Elements/modal.jsx';
import {
    Deposit,
    Withdrawal }          from 'App/Containers/CashierModal';
import Button             from 'deriv-components/lib/button';

const WalletInformation = React.lazy(() => import(/* webpackChunkName: "wallet-information" */'Modules/Reports/Containers/wallet-information.jsx'));
const tabs = {
    deposit : 0,
    withdraw: 1,
};
const modal_content = [
    {
        icon : 'IconDepositSmall',
        label: localize('Deposit'),
        value: Deposit,
    }, {
        icon : 'IconWithdrawalSmall',
        label: localize('Withdrawal'),
        value: Withdrawal,
    },
];
const ToggleCashier = ({
    active_tab,
    className,
    hideFullBlur,
    is_cashier_visible,
    showFullBlur,
    toggleCashier,
}) => (
    <React.Fragment>
        <Button
            className={classNames(className, 'btn--primary btn--primary--orange')}
            has_effect
            text={localize('Deposit')}
            onClick={toggleCashier}
        />
        <Modal
            className='cashier'
            modal_content={modal_content}
            header={<WalletInformation />}
            hideFullBlur={hideFullBlur}
            is_open={is_cashier_visible}
            selected_index={tabs[active_tab]}
            showFullBlur={showFullBlur}
            title={localize('Cashier')}
            toggleModal={toggleCashier}
        />
    </React.Fragment>
);

ToggleCashier.propTypes = {
    active_tab  : PropTypes.string,
    className   : PropTypes.string,
    hideFullBlur: PropTypes.func,
    is_open     : PropTypes.bool,
    showFullBlur: PropTypes.func,
    toggleModal : PropTypes.func,
};

export default ToggleCashier;
