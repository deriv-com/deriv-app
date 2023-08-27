import React from 'react';
import { Money } from '@deriv/components';
import { CFD_PLATFORMS, formatMoney, getCFDAccount, getCFDAccountDisplay, getCFDPlatformLabel } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TCFDPlatform, TDetailsOfDerivXAccount, TDetailsOfMT5Account } from 'Types';
import ClosingAccountPendingWrapper from './closing-account-pending-wrapper';
import ClosingAccountPendingContent from './closing-account-pending-content';

type TClosingAccountPendingBalanceProps = {
    platform: TCFDPlatform;
    account_balance: TDetailsOfMT5Account[] | TDetailsOfDerivXAccount[];
};
const ClosingAccountPendingBalance = observer(({ platform, account_balance }: TClosingAccountPendingBalanceProps) => {
    const { client } = useStore();
    const { is_eu } = client;

    return (
        <ClosingAccountPendingWrapper
            title={
                <Localize
                    i18n_default_text='Please withdraw your funds from the following {{platform_name}} account(s):'
                    values={{ platform_name: getCFDPlatformLabel(platform) }}
                />
            }
        >
            {account_balance.map(account => (
                <ClosingAccountPendingContent
                    key={account.login}
                    currency_icon={`${platform === CFD_PLATFORMS.MT5 ? 'IcMt5' : 'IcDxtrade'}-${getCFDAccount({
                        market_type: account.market_type,
                        sub_account_type: account.sub_account_type,
                        platform,
                        is_eu,
                    })}`}
                    loginid={account.display_login}
                    title={
                        getCFDAccountDisplay({
                            market_type: account.market_type,
                            sub_account_type: account.sub_account_type,
                            platform,
                            is_eu,
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
            ))}
        </ClosingAccountPendingWrapper>
    );
});

export default ClosingAccountPendingBalance;
