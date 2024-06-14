import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile';
import DisplayAccountType from './display-account-type';
import { TAccountInfoDTraderV2 } from './account-actions-dtrader-v2';
import AccountInfoWrapper from './account-info-wrapper';
import {
    CurrencyBusdIcon,
    CurrencyAudIcon,
    CurrencyBchIcon,
    CurrencyUsdtIcon,
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyPlaceholderIcon,
    CurrencyDemoIcon,
    CurrencyMultiCollateralDaiIcon,
    CurrencyEursIcon,
    CurrencyIdkIcon,
    CurrencyPaxIcon,
    CurrencyTusdIcon,
    CurrencyUsdkIcon,
    CurrencyXrpIcon,
} from '@deriv/quill-icons';

const AccountInfoDTraderV2 = ({
    acc_switcher_disabled_message,
    account_type = '',
    balance,
    currency,
    disableApp,
    enableApp,
    is_dialog_on,
    is_eu,
    is_virtual,
    toggleDialog,
    is_disabled,
}: TAccountInfoDTraderV2) => {
    // TODO: remove function into the config?
    const getAccountIcon = (currency: string, is_virtual: boolean) => {
        if (is_virtual) return <CurrencyDemoIcon iconSize='md' />;
        if (!currency) return <CurrencyPlaceholderIcon iconSize='md' />;

        const key = currency.toUpperCase();
        const config = {
            AUD: <CurrencyAudIcon iconSize='md' />,
            BCH: <CurrencyBchIcon iconSize='md' />,
            BUSD: <CurrencyBusdIcon iconSize='md' />,
            DAI: <CurrencyMultiCollateralDaiIcon iconSize='md' />,
            TUSDT: <CurrencyUsdtIcon iconSize='md' />,
            UST: <CurrencyUsdtIcon iconSize='md' />,
            EUSDT: <CurrencyUsdtIcon iconSize='md' />,
            BTC: <CurrencyBtcIcon iconSize='md' />,
            ETH: <CurrencyEthIcon iconSize='md' />,
            LTC: <CurrencyLtcIcon iconSize='md' />,
            USDC: <CurrencyUsdcIcon iconSize='md' />,
            USD: <CurrencyUsdIcon iconSize='md' />,
            EUR: <CurrencyEurIcon iconSize='md' />,
            GBP: <CurrencyGbpIcon iconSize='md' />,
            EURS: <CurrencyEursIcon iconSize='md' />,
            IDK: <CurrencyIdkIcon iconSize='md' />,
            PAX: <CurrencyPaxIcon iconSize='md' />,
            TUSD: <CurrencyTusdIcon iconSize='md' />,
            USDK: <CurrencyUsdkIcon iconSize='md' />,
            XRP: <CurrencyXrpIcon iconSize='md' />,
        };

        return config[key as keyof typeof config] ?? <CurrencyPlaceholderIcon iconSize='md' />;
    };

    // TODO: remove unused css
    // TODO: disabling logic?
    return (
        <React.Fragment>
            <AccountInfoWrapper
                is_disabled={is_disabled}
                disabled_message={acc_switcher_disabled_message}
                is_mobile
                is_dtrader_v2
            >
                <div className='header-v2__acc-info__wrapper' onClick={is_disabled ? undefined : () => toggleDialog()}>
                    {getAccountIcon(currency, !!is_virtual)}
                    {(typeof balance !== 'undefined' || !currency) && (
                        <div className='acc-info__account-type-and-balance'>
                            <p
                                data-testid='dt_balance'
                                className={classNames('acc-info__balance', {
                                    'acc-info__balance--no-currency': !currency && !is_virtual,
                                })}
                            >
                                {!currency ? (
                                    <Localize i18n_default_text='No currency assigned' />
                                ) : (
                                    `${balance} ${getCurrencyDisplayCode(currency)}`
                                )}
                            </p>
                            <Text size='xxxs' line_height='s'>
                                <DisplayAccountType account_type={account_type} is_eu={!!is_eu} />
                            </Text>
                        </div>
                    )}
                    {is_disabled ? (
                        <Icon data_testid='dt_lock_icon' icon='IcLock' />
                    ) : (
                        <Icon
                            data_testid='dt_select_arrow'
                            icon='IcChevronDownBold'
                            className={classNames('header-v2__acc-info__select-arrow', {
                                'header-v2__acc-info__select-arrow--up': is_dialog_on,
                            })}
                        />
                    )}
                </div>
            </AccountInfoWrapper>
            <AccountSwitcherMobile
                is_visible={is_dialog_on}
                disableApp={disableApp}
                enableApp={enableApp}
                toggle={toggleDialog}
            />
        </React.Fragment>
    );
};

export default AccountInfoDTraderV2;
