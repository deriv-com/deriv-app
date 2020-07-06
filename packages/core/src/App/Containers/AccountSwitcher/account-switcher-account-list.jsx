import classNames from 'classnames';
import React from 'react';
import { Icon, Money } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { getMT5AccountDisplay } from 'Stores/Helpers/client';

const AccountList = ({
    account_type,
    balance,
    currency,
    currency_icon,
    display_type,
    has_balance,
    is_disabled,
    is_virtual,
    loginid,
    onClickAccount,
    selected_loginid,
}) => {
    if (is_disabled && !currency) return null;
    return (
        <>
            <div
                id={`dt_${loginid}`}
                className={classNames('acc-switcher__account', {
                    'acc-switcher__account--selected': loginid === selected_loginid,
                    'acc-switcher__account--disabled': is_disabled,
                })}
                onClick={is_disabled ? undefined : onClickAccount}
            >
                <span className={'acc-switcher__id'}>
                    <Icon
                        icon={currency ? currency_icon : 'IcCurrencyUnknown'}
                        className={'acc-switcher__id-icon'}
                        size={24}
                    />
                    <span>
                        {display_type === 'currency' ? (
                            <CurrencyDisplay is_virtual={is_virtual} currency={currency} />
                        ) : (
                            <AccountDisplay account_type={account_type} />
                        )}
                        <div className='acc-switcher__loginid-text'>{loginid}</div>
                    </span>
                    {has_balance && (
                        <span className='acc-switcher__balance'>
                            {currency && (
                                <Money
                                    currency={currency}
                                    amount={formatMoney(currency, balance, true)}
                                    should_format={false}
                                />
                            )}
                        </span>
                    )}
                </span>
            </div>
        </>
    );
};

const CurrencyDisplay = ({ currency, is_virtual }) => {
    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }
    if (!currency) {
        return <Localize i18n_default_text='No currency assigned' />;
    }
    return getCurrencyDisplayCode(currency);
};

const AccountDisplay = ({ account_type }) => <div>{getMT5AccountDisplay(account_type)}</div>;

export default AccountList;
