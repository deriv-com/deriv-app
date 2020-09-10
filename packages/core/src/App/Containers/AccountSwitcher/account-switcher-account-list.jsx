import classNames from 'classnames';
import React from 'react';
import { Icon, Money } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode, getMT5AccountDisplay } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

const AccountList = ({
    account_type,
    balance,
    currency,
    currency_icon,
    display_type,
    has_balance,
    is_eu,
    is_disabled,
    is_virtual,
    loginid,
    onClickAccount,
    selected_loginid,
}) => {
    const market_type = React.useMemo(() => {
        if (loginid.startsWith('MX') || loginid.startsWith('MLT')) {
            return localize('Synthetic');
        } else if (loginid.startsWith('MF')) {
            return localize('Financial');
        }
        return '';
    }, [loginid]);

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
                <span className='acc-switcher__id'>
                    <Icon
                        icon={currency ? currency_icon : 'IcCurrencyUnknown'}
                        className={'acc-switcher__id-icon'}
                        size={24}
                    />
                    <span>
                        {display_type === 'currency' ? (
                            <CurrencyDisplay
                                is_virtual={is_virtual}
                                currency={currency}
                                is_eu={is_eu}
                                market_type={market_type}
                            />
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

const CurrencyDisplay = ({ currency, is_eu, is_virtual, market_type }) => {
    if (is_virtual) {
        return <Localize i18n_default_text='Demo' />;
    }
    if (!currency) {
        return <Localize i18n_default_text='No currency assigned' />;
    }
    if (is_eu) {
        return `${getCurrencyDisplayCode(currency)} ${market_type}`;
    }
    return getCurrencyDisplayCode(currency);
};

const AccountDisplay = ({ account_type }) => <div>{getMT5AccountDisplay(account_type)}</div>;

export default AccountList;
