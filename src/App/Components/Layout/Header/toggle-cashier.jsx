import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import React              from 'react';
import { CSSTransition }  from 'react-transition-group';
import { localize }       from 'App/i18n';
import { Modal }          from 'App/Components/Elements/modal.jsx';
import {
    Deposit,
    Withdraw }            from 'App/Containers/CashierModal';
import WalletInformation  from 'Modules/Reports/Containers/wallet-information.jsx';
import Button             from '../../Form/button.jsx';

const ToggleCashier = ({
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
        <CSSTransition
            in={is_cashier_visible}
            timeout={250}
            classNames={{
                enter    : 'cashier-modal__container--enter',
                enterDone: 'cashier-modal__container--enter-done',
                exit     : 'cashier-modal__container--exit',
            }}
            unmountOnExit
        >
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
                        value: Withdraw,
                    },
                ]}
                header={<WalletInformation />}
                hideFullBlur={hideFullBlur}
                is_open={is_cashier_visible}
                showFullBlur={showFullBlur}
                title={localize('Cashier')}
                toggleModal={toggleCashier}
            />
        </CSSTransition>
    </React.Fragment>
);

ToggleCashier.propTypes = {
    className   : PropTypes.string,
    hideFullBlur: PropTypes.func,
    is_open     : PropTypes.bool,
    showFullBlur: PropTypes.func,
    toggleModal : PropTypes.func,
};

export { ToggleCashier };
