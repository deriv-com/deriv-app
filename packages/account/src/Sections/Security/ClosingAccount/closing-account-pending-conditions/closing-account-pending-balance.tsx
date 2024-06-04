import React from 'react';
import { Money } from '@deriv/components';
import {
    CFD_PLATFORMS,
    formatMoney,
    getCFDAccount,
    getCFDAccountDisplay,
    getCFDPlatformLabel,
    getMT5Icon,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TCFDPlatform, TDetailsOfDerivXAccount, TDetailsOfMT5Account } from 'Types';
import ClosingAccountPendingWrapper from './closing-account-pending-wrapper';
import ClosingAccountPendingContent from './closing-account-pending-content';

type TClosingAccountPendingBalanceProps = {
    platform: TCFDPlatform;
    account_balance: TDetailsOfMT5Account[] | TDetailsOfDerivXAccount[];
};

type TShortcode = Parameters<typeof getCFDAccountDisplay>[0]['shortcode'];

const ClosingAccountPendingBalance = observer(({ platform, account_balance }: TClosingAccountPendingBalanceProps) => {
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;

    const is_mt5_platform = platform === CFD_PLATFORMS.MT5;

    return (
        <ClosingAccountPendingWrapper
            title={
                <Localize
                    i18n_default_text='Please withdraw your funds from the following {{platform_name}} account(s):'
                    values={{ platform_name: getCFDPlatformLabel(platform) }}
                />
            }
        >
            {account_balance.map(account => {
                const getCurrencyIcon = (platform: TCFDPlatform) => {
                    switch (platform) {
                        case CFD_PLATFORMS.MT5:
                            return `IcMt5-${getMT5Icon({
                                market_type: account.market_type,
                                is_eu: is_eu_user,
                            })}`;
                        case CFD_PLATFORMS.DXTRADE:
                            return `IcDxtrade-${getCFDAccount({
                                market_type: account.market_type,
                                sub_account_type: account.sub_account_type,
                                platform,
                                is_eu: is_eu_user,
                            })}`;
                        case CFD_PLATFORMS.CTRADER:
                            return `IcCtrader`;
                        default:
                            return '';
                    }
                };
                return (
                    <ClosingAccountPendingContent
                        key={account.login}
                        currency_icon={getCurrencyIcon(platform)}
                        loginid={account.display_login}
                        title={
                            getCFDAccountDisplay({
                                market_type: account.market_type,
                                sub_account_type: account.sub_account_type,
                                platform,
                                shortcode: is_mt5_platform ? (account.landing_company_short as TShortcode) : undefined,
                                is_eu: is_eu_user,
                            }) ?? ''
                        }
                        value={
                            account.currency && (
                                <Money
                                    currency={account.currency}
                                    amount={formatMoney(account.currency, account.balance ?? 0, true)}
                                    should_format={false}
                                />
                            )
                        }
                    />
                );
            })}
        </ClosingAccountPendingWrapper>
    );
});

export default ClosingAccountPendingBalance;
