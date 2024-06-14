import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import AccountSwitcherMobile from 'App/Containers/AccountSwitcher/account-switcher-mobile';
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
    LabelPairedChevronDownCaptionRegularIcon,
    LabelPairedLockCaptionRegularIcon,
} from '@deriv/quill-icons';
import { CaptionText, Heading } from '@deriv-com/quill-ui';

const AccountInfoDTraderV2 = ({
    acc_switcher_disabled_message,
    // account_type = '',
    balance,
    currency,
    disableApp,
    enableApp,
    is_dialog_on,
    // is_eu,
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
                    <div className='header-v2__acc-info'>
                        <div className='header-v2__acc-info__name'>
                            <CaptionText color='quill-typography__color--default'>
                                <Localize i18n_default_text='Placeholder' />
                            </CaptionText>
                            {is_disabled ? (
                                <LabelPairedLockCaptionRegularIcon />
                            ) : (
                                <LabelPairedChevronDownCaptionRegularIcon
                                    className={classNames('header-v2__acc-info__select-arrow', {
                                        'header-v2__acc-info__select-arrow--up': is_dialog_on,
                                    })}
                                />
                            )}
                        </div>
                        {(balance ?? !currency) && (
                            <Heading.H5 color='quill-typography__color--default'>
                                {/* TODO: case without currency is taken from current production. No design */}
                                {!currency ? (
                                    <Localize i18n_default_text='No currency assigned' />
                                ) : (
                                    `${balance} ${getCurrencyDisplayCode(currency)}`
                                )}
                                {/* <Text size='xxxs' line_height='s'>
                                    <DisplayAccountType account_type={account_type} is_eu={!!is_eu} />
                                </Text> */}
                            </Heading.H5>
                        )}
                    </div>
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
