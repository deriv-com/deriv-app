import { Button, Icon, Popover } from 'deriv-components';
import * as PropTypes       from 'prop-types';
import React, { Component } from 'react';
import { localize }         from 'deriv-translations';
import CurrencyUtils        from 'deriv-shared/utils/currency';
import routes               from 'Constants/routes';
import { LoginButton }      from './login-button.jsx';
import { SignupButton }     from './signup-button.jsx';
import ToggleNotifications  from './toggle-notifications.jsx';
import { BinaryLink }       from '../../Routes';
import                           'Sass/app/_common/components/account-switcher.scss';

const AccountInfo = React.lazy(() => import(/* webpackChunkName: "account-info", webpackPreload: true */'App/Components/Layout/Header/account-info.jsx'));

export class AccountActions extends Component {
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.balance !== this.props.balance ||
            nextProps.can_upgrade !== this.props.can_upgrade ||
            nextProps.can_upgrade_to !== this.props.can_upgrade_to ||
            nextProps.currency !== this.props.currency ||
            nextProps.is_acc_switcher_on !== this.props.is_acc_switcher_on ||
            nextProps.is_notifications_visible !== this.props.is_notifications_visible ||
            nextProps.is_logged_in !== this.props.is_logged_in ||
            nextProps.is_virtual !== this.props.is_virtual ||
            nextProps.loginid !== this.props.loginid ||
            nextProps.notifications_count !== this.props.notifications_count
        );
    }

    render() {
        const {
            balance,
            can_upgrade,
            currency,
            is_acc_switcher_on,
            is_logged_in,
            is_notifications_visible,
            is_virtual,
            notifications_count,
            onClickDeposit,
            openRealAccountSignup,
            toggleAccountsDialog,
            toggleNotifications,
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
                            <Icon icon='IcUser' />
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
                    <Button
                        className='acc-info__button'
                        has_effect
                        text={localize('Deposit')}
                        onClick={onClickDeposit}
                        primary
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
    balance                 : PropTypes.any,
    can_upgrade             : PropTypes.any,
    can_upgrade_to          : PropTypes.any,
    currency                : PropTypes.any,
    is_acc_switcher_on      : PropTypes.any,
    is_logged_in            : PropTypes.any,
    is_notifications_visible: PropTypes.any,
    is_virtual              : PropTypes.any,
    notifications_count     : PropTypes.any,
    onClickDeposit          : PropTypes.func,
    openRealAccountSignup   : PropTypes.func,
    toggleAccountsDialog    : PropTypes.any,
    toggleNotifications     : PropTypes.any,
};
