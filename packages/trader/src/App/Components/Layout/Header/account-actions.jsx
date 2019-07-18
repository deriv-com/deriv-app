import React             from 'react';
import { formatMoney }   from '_common/base/currency_base';
import { urlFor }        from '_common/url';
import Button            from 'App/Components/Form/button.jsx';
import Lazy              from 'App/Containers/Lazy';
import { localize }      from 'App/i18n';
import { LoginButton }   from './login-button.jsx';
import { SignupButton }  from './signup-button.jsx';
import { UpgradeButton } from './upgrade-button.jsx';

export const AccountActions = ({
    is_logged_in,
    currency,
    balance,
    can_upgrade,
    is_virtual,
    onClickUpgrade,
    loginid,
    is_acc_switcher_on,
    toggleAccountsDialog,
    can_upgrade_to,
}) => {
    if (is_logged_in) {

        return (
            <React.Fragment>
                <Lazy
                    ctor={() => import(/* webpackChunkName: "account-info" */'App/Components/Layout/Header/account-info.jsx')}
                    should_load={true}
                    has_progress={true}
                    is='AccountInfo'
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
                { !(is_virtual) &&
                // TODO: uncomment this to open cashier popup
                // <ToggleCashier
                //      className='acc-info__button'
                //      toggleCashier={toggleCashierModal}
                //      is_cashier_visible={is_cashier_modal_on}
                //      showFullBlur={showFullBlur}
                //      hideFullBlur={hideFullBlur}
                //  />
                // TODO: remove this when cashier pop up is ready
                <Button
                    className='btn--primary btn--primary--orange acc-info__button'
                    has_effect
                    text={localize('Deposit')}
                    onClick={() => {
                        window.open(urlFor('cashier', undefined, undefined, true), '_blank', 'noopener', 'noreferrer');
                    }}
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
};
