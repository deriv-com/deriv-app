import * as PropTypes       from 'prop-types';
import React, { Component } from 'react';
import { formatMoney }      from '_common/base/currency_base';
import { urlFor }           from '_common/url';
// import Button               from 'App/Components/Form/button.jsx';
import Lazy                 from 'App/Containers/Lazy';
// import { localize }         from 'App/i18n';
import { LoginButton }      from './login-button.jsx';
import { SignupButton }     from './signup-button.jsx';
import { UpgradeButton }    from './upgrade-button.jsx';
import 'Sass/app/_common/components/account-switcher.scss';

export class AccountActions extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.active_cashier_tab !== this.props.active_cashier_tab ||
            nextProps.balance !== this.props.balance ||
            nextProps.can_upgrade !== this.props.can_upgrade ||
            nextProps.can_upgrade_to !== this.props.can_upgrade_to ||
            nextProps.currency !== this.props.currency ||
            nextProps.is_acc_switcher_on !== this.props.is_acc_switcher_on ||
            nextProps.is_cashier_modal_on !== this.props.is_cashier_modal_on ||
            nextProps.is_logged_in !== this.props.is_logged_in ||
            nextProps.is_virtual !== this.props.is_virtual ||
            nextProps.loginid !== this.props.loginid
        );
    }

    render() {
        const {
            active_cashier_tab,
            balance,
            can_upgrade,
            can_upgrade_to,
            currency,
            hideFullBlur,
            is_acc_switcher_on,
            is_cashier_modal_on,
            is_logged_in,
            is_virtual,
            loginid,
            onClickUpgrade,
            toggleAccountsDialog,
            toggleCashierModal,
            showFullBlur,
        } = this.props;
        if (is_logged_in) {
            return (
                <React.Fragment>
                    <Lazy
                        ctor={() => import(/* webpackChunkName: "account-info", webpackPreload: true */'App/Components/Layout/Header/account-info.jsx')}
                        should_load={true}
                        has_progress={false}
                        balance={formatMoney(currency, balance, true)}
                        is_upgrade_enabled={can_upgrade}
                        is_virtual={is_virtual}
                        onClickUpgrade={onClickUpgrade}
                        currency={currency}
                        loginid={loginid}
                        is_dialog_on={is_acc_switcher_on}
                        toggleDialog={toggleAccountsDialog}
                    />
                    {!!(
                        can_upgrade_to && is_virtual
                    ) && <UpgradeButton
                        className='acc-info__button'
                        onClick={() => {
                            window.open(urlFor('user/accounts', undefined, undefined, true));
                        }}
                    />}
                    <Lazy
                        ctor={() => import(/* webpackChunkName: "toggle-cashier", webpackPrefetch: true */'App/Components/Layout/Header/toggle-cashier.jsx')}
                        should_load={!is_virtual}
                        active_tab={active_cashier_tab}
                        className='acc-info__button'
                        toggleCashier={toggleCashierModal}
                        is_cashier_visible={is_cashier_modal_on}
                        showFullBlur={showFullBlur}
                        hideFullBlur={hideFullBlur}
                    />
                    {/* {!( */}
                    {/*     is_virtual */}
                    {/* ) && // TODO: remove this when cashier pop up is ready */}
                    {/*  <Button */}
                    {/*     className='btn--primary btn--primary--orange acc-info__button' */}
                    {/*     has_effect */}
                    {/*     text={localize('Deposit')} */}
                    {/*     onClick={() => { */}
                    {/*         window.open(urlFor('cashier', undefined, undefined, true), */}
                    {/*             '_blank', */}
                    {/*             'noopener', */}
                    {/*             'noreferrer', */}
                    {/*         ); */}
                    {/*     }} */}
                    {/* />} */}
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
    active_cashier_tab  : PropTypes.any,
    balance             : PropTypes.any,
    can_upgrade         : PropTypes.any,
    can_upgrade_to      : PropTypes.any,
    currency            : PropTypes.any,
    hideFullBlur        : PropTypes.any,
    is_acc_switcher_on  : PropTypes.any,
    is_cashier_modal_on : PropTypes.any,
    is_logged_in        : PropTypes.any,
    is_virtual          : PropTypes.any,
    loginid             : PropTypes.any,
    onClickUpgrade      : PropTypes.any,
    showFullBlur        : PropTypes.any,
    toggleAccountsDialog: PropTypes.any,
    toggleCashierModal  : PropTypes.any,
};
