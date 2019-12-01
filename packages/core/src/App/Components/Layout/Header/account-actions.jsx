import { Button, Popover }  from 'deriv-components';
import * as PropTypes       from 'prop-types';
import React, { Component } from 'react';
import { localize }         from 'deriv-translations';
import CurrencyUtils        from 'deriv-shared/utils/currency';
import Icon                 from 'Assets/icon.jsx';
import routes               from 'Constants/routes';
import { LoginButton }      from './login-button.jsx';
import { SignupButton }     from './signup-button.jsx';
import ToggleNotifications  from './toggle-notifications.jsx';
import ToggleCashier        from './toggle-cashier.jsx';
import { BinaryLink }       from '../../Routes';
import                           'Sass/app/_common/components/account-switcher.scss';

const AccountInfo = React.lazy(() => import(/* webpackChunkName: "account-info", webpackPreload: true */'App/Components/Layout/Header/account-info.jsx'));

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
            nextProps.is_notifications_visible !== this.props.is_notifications_visible ||
            nextProps.is_payment_agent_visible !== this.props.is_payment_agent_visible ||
            nextProps.is_payment_agent_transfer_visible !== this.props.is_payment_agent_transfer_visible ||
            nextProps.is_logged_in !== this.props.is_logged_in ||
            nextProps.is_virtual !== this.props.is_virtual ||
            nextProps.loginid !== this.props.loginid ||
            nextProps.notifications_count !== this.props.notifications_count
        );
    }

    render() {
        const {
            active_cashier_tab,
            balance,
            can_upgrade,
            currency,
            is_acc_switcher_on,
            is_cashier_modal_on,
            is_logged_in,
            is_notifications_visible,
            is_payment_agent_visible,
            is_payment_agent_transfer_visible,
            is_virtual,
            notifications_count,
            openRealAccountSignup,
            setCashierActiveTab,
            toggleAccountsDialog,
            toggleNotifications,
            toggleCashierModal,
        } = this.props;
        if (is_logged_in) {
            return (
                <React.Fragment>
                    <ToggleNotifications
                        count={notifications_count}
                        is_visible={is_notifications_visible}
                        toggleDialog={toggleNotifications}
                        tooltip_message={localize('View notifications')}
                    />
                    <Popover
                        classNameBubble='account-settings-toggle__tooltip'
                        alignment='bottom'
                        message={localize('Manage account settings')}
                    >
                        <BinaryLink
                            className='account-settings-toggle'
                            to={ routes.personal_details }
                        >
                            <Icon icon='IconUser' />
                        </BinaryLink>
                    </Popover>
                    <React.Suspense fallback={<div />}>
                        <AccountInfo
                            balance={typeof balance === 'undefined' ? balance : CurrencyUtils.formatMoney(currency, balance, true)}
                            is_upgrade_enabled={can_upgrade}
                            is_virtual={is_virtual}
                            currency={currency}
                            is_dialog_on={is_acc_switcher_on}
                            toggleDialog={toggleAccountsDialog}
                        />
                    </React.Suspense>
                    {!is_virtual && !currency &&
                        <div className='set-currency'>
                            <Button
                                onClick={openRealAccountSignup}
                                has_effect
                                type='button'
                                text={localize('Set currency')}
                                primary
                            />
                        </div>
                    }
                    {currency &&
                    <ToggleCashier
                        active_tab={active_cashier_tab}
                        className='acc-info__button'
                        toggleCashier={toggleCashierModal}
                        is_cashier_visible={is_cashier_modal_on}
                        is_payment_agent_visible={is_payment_agent_visible}
                        is_payment_agent_transfer_visible={is_payment_agent_transfer_visible}
                        setCashierActiveTab={setCashierActiveTab}
                    />
                    }
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
    active_cashier_tab               : PropTypes.any,
    balance                          : PropTypes.any,
    can_upgrade                      : PropTypes.any,
    can_upgrade_to                   : PropTypes.any,
    currency                         : PropTypes.any,
    is_acc_switcher_on               : PropTypes.any,
    is_cashier_modal_on              : PropTypes.any,
    is_logged_in                     : PropTypes.any,
    is_notifications_visible         : PropTypes.any,
    is_payment_agent_transfer_visible: PropTypes.any,
    is_payment_agent_visible         : PropTypes.any,
    is_virtual                       : PropTypes.any,
    notifications_count              : PropTypes.any,
    openRealAccountSignup            : PropTypes.func,
    setCashierActiveTab              : PropTypes.func,
    toggleAccountsDialog             : PropTypes.any,
    toggleCashierModal               : PropTypes.any,
    toggleNotifications              : PropTypes.any,
};
