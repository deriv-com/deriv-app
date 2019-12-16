import classNames               from 'classnames';
import React                    from 'react';
import { Money, Popover }       from 'deriv-components';
import CurrencyUtils            from 'deriv-shared/utils/currency';
import { Localize }             from 'deriv-translations';
import Icon                     from 'Assets/icon.jsx';
import { getMT5AccountDisplay } from 'Stores/Helpers/client';

const AccountList = ({
    account_type,
    balance,
    currency,
    currency_icon,
    display_type,
    has_balance,
    has_demo_text,
    is_disabled,
    is_virtual,
    loginid,
    onClickAccount,
    selected_loginid,
}) => (
    <Popover alignment='left' message={loginid}>
        <div
            id={`dt_${loginid}`}
            className={classNames('acc-switcher__account', {
                'acc-switcher__account--selected' : loginid === selected_loginid,
                'acc-switcher__account--disabled' : is_disabled,
                'acc-switcher__account--demo-text': has_demo_text,
            })}
            onClick={is_disabled ? undefined : onClickAccount}
        >
            <span className={'acc-switcher__id'}>
                <Icon
                    icon='IconAccountsCurrency'
                    className={`acc-switcher__id-icon acc-switcher__id-icon--${currency_icon}`}
                    type={currency_icon}
                />
                <span>
                    {display_type === 'currency'
                        ? <CurrencyDisplay is_virtual={is_virtual} currency={currency_icon} />
                        : <AccountDisplay is_virtual={has_demo_text} account_type={account_type} />
                    }
                </span>
                {has_balance &&
                <span className={classNames('acc-switcher__balance', { 'acc-switcher__balance--virtual': is_virtual || has_demo_text })}>
                    {currency &&
                    <Money
                        currency={currency}
                        amount={CurrencyUtils.formatMoney(currency, balance, true)}
                        should_format={false}
                    />
                    }
                    {!currency &&
                    <span className='no-currency'>
                        <Localize i18n_default_text='No currency assigned' />
                    </span>
                    }
                </span>
                }
            </span>
        </div>
    </Popover>
);

const CurrencyDisplay = ({
    currency,
    is_virtual,
}) => {
    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }
    if (currency.toUpperCase() === 'REAL') {
        return <Localize i18n_default_text='Real' />;
    }
    return currency.toUpperCase();
};

const AccountDisplay = ({
    account_type,
    is_virtual,
}) => (
    <React.Fragment>
        {is_virtual &&
        <div className='acc-switcher__demo-text'>
            <Localize i18n_default_text='Demo' />
        </div>
        }
        <div>
            {getMT5AccountDisplay(account_type)}
        </div>
    </React.Fragment>
);

export default AccountList;
