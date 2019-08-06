import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { localize } from 'App/i18n';
import { Modal }    from 'App/Components/Elements/modal.jsx';
import {
    Deposit,
    Withdrawal }    from 'App/Containers/CashierModal';
import Button       from '../../Form/button.jsx';

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
    enableApp,
    is_cashier_visible,
    disableApp,
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
            disableApp={disableApp}
            enableApp={enableApp}
            header={<WalletInformation />}
            modal_content={modal_content}
            is_open={is_cashier_visible}
            selected_index={tabs[active_tab]}
            title={localize('Cashier')}
            toggleModal={toggleCashier}
        />
    </React.Fragment>
);

ToggleCashier.propTypes = {
    active_tab : PropTypes.string,
    className  : PropTypes.string,
    disableApp : PropTypes.func,
    enableApp  : PropTypes.func,
    is_open    : PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default ToggleCashier;
