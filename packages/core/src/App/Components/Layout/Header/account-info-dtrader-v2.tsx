import React from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getCurrencyName } from '@deriv/shared';
import AccountSwitcherDTraderV2 from 'App/Containers/AccountSwitcher/account-switcher-dtrader-v2';
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
import { CaptionText, Heading, ActionSheet } from '@deriv-com/quill-ui';

const AccountInfoDTraderV2 = ({
    acc_switcher_disabled_message,
    // account_type = '',
    balance,
    currency,
    is_dialog_on,
    // is_eu,
    is_virtual,
    toggleDialog,
    is_disabled,
    loginid,
}: TAccountInfoDTraderV2) => {
    // TODO: remove function into the config?
    const getAccountIcon = (
        currency?: string,
        is_virtual?: boolean,
        size?: React.ComponentProps<typeof CurrencyDemoIcon>['iconSize']
    ) => {
        if (is_virtual) return <CurrencyDemoIcon iconSize={size} />;
        if (!currency) return <CurrencyPlaceholderIcon iconSize={size} />;

        const key = currency.toUpperCase();
        const config = {
            AUD: <CurrencyAudIcon iconSize={size} />,
            BCH: <CurrencyBchIcon iconSize={size} />,
            BUSD: <CurrencyBusdIcon iconSize={size} />,
            DAI: <CurrencyMultiCollateralDaiIcon iconSize={size} />,
            TUSDT: <CurrencyUsdtIcon iconSize={size} />,
            UST: <CurrencyUsdtIcon iconSize={size} />,
            EUSDT: <CurrencyUsdtIcon iconSize={size} />,
            BTC: <CurrencyBtcIcon iconSize={size} />,
            ETH: <CurrencyEthIcon iconSize={size} />,
            LTC: <CurrencyLtcIcon iconSize={size} />,
            USDC: <CurrencyUsdcIcon iconSize={size} />,
            USD: <CurrencyUsdIcon iconSize={size} />,
            EUR: <CurrencyEurIcon iconSize={size} />,
            GBP: <CurrencyGbpIcon iconSize={size} />,
            EURS: <CurrencyEursIcon iconSize={size} />,
            IDK: <CurrencyIdkIcon iconSize={size} />,
            PAX: <CurrencyPaxIcon iconSize={size} />,
            TUSD: <CurrencyTusdIcon iconSize={size} />,
            USDK: <CurrencyUsdkIcon iconSize={size} />,
            XRP: <CurrencyXrpIcon iconSize={size} />,
        };

        return config[key as keyof typeof config] ?? <CurrencyPlaceholderIcon iconSize={size} />;
    };
    //TODO: move to helper (together with the duplicates)
    const CurrencyDisplay = ({
        currency,
        loginid,
        is_virtual,
    }: {
        currency?: string;
        loginid?: string;
        is_virtual?: boolean;
    }) => {
        const account_type = loginid?.replace(/\d/g, '');

        if (account_type === 'MF') {
            return <Localize i18n_default_text='Multipliers' />;
        }

        if (is_virtual) {
            return <Localize i18n_default_text='Demo' />;
        }

        if (!currency) {
            return <Localize i18n_default_text='No currency assigned' />;
        }

        return getCurrencyName(currency);
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
                <button
                    className='header-v2__acc-info__wrapper'
                    onClick={is_disabled ? undefined : () => toggleDialog()}
                >
                    {getAccountIcon(currency, !!is_virtual, 'md')}
                    <div className='header-v2__acc-info'>
                        <div className='header-v2__acc-info__name'>
                            <CaptionText color='quill-typography__color--default'>
                                {CurrencyDisplay({ currency, loginid, is_virtual })}
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
                            <Heading.H5 className='header-v2__acc-info__balance'>
                                {/* TODO: case without currency is taken from current production. No design */}
                                {!currency ? (
                                    <Localize i18n_default_text='No currency assigned' />
                                ) : (
                                    `${balance} ${getCurrencyDisplayCode(currency)}`
                                )}
                            </Heading.H5>
                        )}
                    </div>
                </button>
            </AccountInfoWrapper>
            <ActionSheet.Root isOpen={is_dialog_on} onClose={() => toggleDialog(false)} position='left'>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Content>
                        <AccountSwitcherDTraderV2 is_visible />
                    </ActionSheet.Content>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
};

export default AccountInfoDTraderV2;
