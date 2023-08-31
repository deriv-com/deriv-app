import React from 'react';
import { CFD_PLATFORMS, getCFDAccount, getCFDAccountDisplay, getCFDPlatformLabel } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { TCFDPlatform, TDetailsOfDerivXAccount, TDetailsOfMT5Account } from 'Types';
import ClosingAccountPendingWrapper from './closing-account-pending-wrapper';
import ClosingAccountPendingContent from './closing-account-pending-content';

type TClosingAccountPendingPositionsProps = {
    platform: TCFDPlatform;
    open_positions: Array<TDetailsOfMT5Account | TDetailsOfDerivXAccount>;
};

const ClosingAccountPendingPositions = observer(
    ({ platform, open_positions }: TClosingAccountPendingPositionsProps) => {
        const { client } = useStore();
        const { is_eu } = client;
        return (
            <ClosingAccountPendingWrapper
                title={
                    <Localize
                        i18n_default_text='Please close your positions in the following {{platform_name}} account(s):'
                        values={{ platform_name: getCFDPlatformLabel(platform) }}
                    />
                }
            >
                {open_positions.map(account => (
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
                            <Localize
                                i18n_default_text='{{number_of_positions}} position(s)'
                                values={{ number_of_positions: account.positions }}
                            />
                        }
                    />
                ))}
            </ClosingAccountPendingWrapper>
        );
    }
);

export default ClosingAccountPendingPositions;
