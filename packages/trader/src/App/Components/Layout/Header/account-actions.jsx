import { Button }           from 'deriv-components';
import * as PropTypes       from 'prop-types';
import React, { Component } from 'react';
import { formatMoney }      from '_common/base/currency_base';
import { urlFor }           from '_common/url';
import { localize }         from 'App/i18n';
import { LoginButton }      from './login-button.jsx';
import { SignupButton }     from './signup-button.jsx';
import ToggleAccountManagement from './toggle-account-management.jsx';
// import ToggleCashier        from './toggle-cashier.jsx';
import { UpgradeButton }    from './upgrade-button.jsx';
import 'Sass/app/_common/components/account-switcher.scss';

const AccountInfo = React.lazy(() => import(/* webpackChunkName: "account-info", webpackPreload: true */'App/Components/Layout/Header/account-info.jsx'));

export class AccountActions extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            // nextProps.active_cashier_tab !== this.props.active_cashier_tab ||
            nextProps.balance !== this.props.balance ||
            nextProps.can_upgrade !== this.props.can_upgrade ||
            nextProps.can_upgrade_to !== this.props.can_upgrade_to ||
            nextProps.currency !== this.props.currency ||
            nextProps.is_acc_switcher_on !== this.props.is_acc_switcher_on ||
            // nextProps.is_cashier_modal_on !== this.props.is_cashier_modal_on ||
            nextProps.is_account_management_modal_on !== this.props.is_account_management_modal_on ||
            nextProps.is_logged_in !== this.props.is_logged_in ||
            nextProps.is_virtual !== this.props.is_virtual ||
            nextProps.loginid !== this.props.loginid
        );
    }

    render() {
        const {
            // active_cashier_tab,
            balance,
            can_upgrade,
            can_upgrade_to,
            currency,
            is_acc_switcher_on,
            // is_cashier_modal_on,
            is_account_management_modal_on,
            is_logged_in,
            is_virtual,
            loginid,
            onClickUpgrade,
            toggleAccountsDialog,
            // toggleCashierModal,
            toggleAccountManagementModal,
        } = this.props;
        if (is_logged_in) {
            return (
                <React.Fragment>
                    <ToggleAccountManagement
                        is_open={is_account_management_modal_on}
                        toggleModal={toggleAccountManagementModal}
                    />
                    <React.Suspense fallback={<div />}>
                        <AccountInfo
                            balance={formatMoney(currency, balance, true)}
                            is_upgrade_enabled={can_upgrade}
                            is_virtual={is_virtual}
                            onClickUpgrade={onClickUpgrade}
                            currency={currency}
                            loginid={loginid}
                            is_dialog_on={is_acc_switcher_on}
                            toggleDialog={toggleAccountsDialog}
                        />
                    </React.Suspense>
                    {!!(
                        can_upgrade_to && is_virtual
                    ) && <UpgradeButton
                        className='acc-info__button'
                        onClick={() => {
                            window.open(urlFor('user/accounts', undefined, undefined, true));
                        }}
                    />}
                    {/* {!is_virtual && */}
                    {/* <ToggleCashier */}
                    {/*    active_tab={active_cashier_tab} */}
                    {/*    className='acc-info__button' */}
                    {/*    toggleCashier={toggleCashierModal} */}
                    {/*    is_cashier_visible={is_cashier_modal_on} */}
                    {/* /> */}
                    {/* } */}
                    {!(
                        is_virtual
                    ) && // TODO: remove this when cashier pop up is ready
                    <Button
                        id='dt_deposit_button'
                        className='btn--primary btn--primary--orange acc-info__button'
                        has_effect
                        text={localize('Deposit')}
                        onClick={() => {
                            window.open(urlFor('cashier', undefined, undefined, true),
                                '_blank',
                                'noopener',
                                'noreferrer',
                            );
                        }}
                    />}
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <LoginButton className='acc-info__button' />
                <SignupButton className='acc-info__button' />
            </React.Fragment>
        );
    }
}

AccountActions.propTypes = {
    // active_cashier_tab  : PropTypes.any,
    balance             : PropTypes.any,
    can_upgrade         : PropTypes.any,
    can_upgrade_to      : PropTypes.any,
    currency            : PropTypes.any,
    is_acc_switcher_on  : PropTypes.any,
    // is_cashier_modal_on : PropTypes.any,
    is_logged_in        : PropTypes.any,
    is_virtual          : PropTypes.any,
    loginid             : PropTypes.any,
    onClickUpgrade      : PropTypes.any,
    toggleAccountsDialog: PropTypes.any,
    // toggleCashierModal  : PropTypes.any,
};
