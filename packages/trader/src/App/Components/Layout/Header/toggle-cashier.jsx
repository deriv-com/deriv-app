import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
import { localize }       from 'App/i18n';
import { Modal }          from 'App/Components/Elements/modal.jsx';
import {
    Deposit,
    Withdrawal }          from 'App/Containers/CashierModal';
import WalletInformation  from 'Modules/Reports/Containers/wallet-information.jsx';
import Button             from '../../Form/button.jsx';

const tabs = {
    deposit : 0,
    withdraw: 1,
};

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
            modal_content={[
                {
                    icon : 'IconDepositSmall',
                    label: localize('Deposit'),
                    value: Deposit,
                }, {
                    icon : 'IconWithdrawalSmall',
                    label: localize('Withdrawal'),
                    value: Withdrawal,
                },
            ]}
            header={<WalletInformation />}
            enableApp={enableApp}
            is_open={is_cashier_visible}
            selected_index={tabs[active_tab]}
            disableApp={disableApp}
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

export { ToggleCashier };
