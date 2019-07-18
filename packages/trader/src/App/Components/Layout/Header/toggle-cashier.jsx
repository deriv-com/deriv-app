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
    hideFullBlur,
    is_cashier_visible,
    showFullBlur,
    toggleCashier,
    onUnmount,
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
            hideFullBlur={hideFullBlur}
            is_open={is_cashier_visible}
            selected_index={tabs[active_tab]}
            showFullBlur={showFullBlur}
            title={localize('Cashier')}
            toggleModal={toggleCashier}
            onUnmount={onUnmount}
        />
    </React.Fragment>
);

ToggleCashier.propTypes = {
    active_tab  : PropTypes.string,
    className   : PropTypes.string,
    hideFullBlur: PropTypes.func,
    is_open     : PropTypes.bool,
    onUnmount   : PropTypes.func,
    showFullBlur: PropTypes.func,
    toggleModal : PropTypes.func,
};

export { ToggleCashier };
