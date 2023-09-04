import React from 'react';
import { Popover, Text } from '@deriv/components';
import { useCFDAccounts, usePlatformAccounts, useThrottle, useTotalAccountBalance } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import BalanceText from 'Components/elements/text/balance-text';

const TotalAsset = observer(() => {
    const { traders_hub, client, common, ui } = useStore();
    const { is_mobile } = ui;
    const { selected_account_type, is_eu_user, no_CR_account, no_MF_account } = traders_hub;
    const { default_currency } = client;
    const { current_language } = common;
    const { real: platform_real_accounts, demo: platform_demo_account } = usePlatformAccounts();
    const { real: cfd_real_accounts, demo: cfd_demo_accounts } = useCFDAccounts();
    const platform_real_balance = useTotalAccountBalance(platform_real_accounts);
    const cfd_real_balance = useTotalAccountBalance(cfd_real_accounts);
    const cfd_demo_balance = useTotalAccountBalance(cfd_demo_accounts);
    const is_real = selected_account_type === 'real';
    const real_total_balance = platform_real_balance.balance + cfd_real_balance.balance;
    const demo_total_balance = (platform_demo_account?.balance || 0) + cfd_demo_balance.balance;

    // for total asset first we need to check local storage if it's not set we can use the bellow code to set it
    const total_asset = is_real
        ? useThrottle(real_total_balance, 60 * 1000)
        : useThrottle(demo_total_balance, 60 * 1000);

    //for the next times we can compare the storage data's date with the new calculated data and if the exchange_rate date is newer the we can update the storage data and use it to rerender the page

    // if selected region is non-eu, check active cr accounts, if selected region is eu- check active mf accounts
    const has_active_related_deriv_account = !((no_CR_account && !is_eu_user) || (no_MF_account && is_eu_user));
    return (
        <div className='asset-summary'>
            {has_active_related_deriv_account || selected_account_type === 'demo' ? (
                <React.Fragment>
                    {!is_mobile ? (
                        <Text align='right' key={`asset-summary--key-${current_language}`} size='xs' line_height='s'>
                            {localize('Total assets')}
                        </Text>
                    ) : null}
                    <Popover
                        alignment={is_mobile ? 'top' : 'left'}
                        message={localize('Total assets in all your accounts')}
                        zIndex={9999}
                        is_bubble_hover_enabled
                    >
                        <BalanceText
                            currency={
                                is_real
                                    ? platform_real_balance.currency || ''
                                    : platform_demo_account?.currency || default_currency
                            }
                            balance={total_asset}
                            underline_style='dotted'
                        />
                    </Popover>
                </React.Fragment>
            ) : null}
        </div>
    );
});

export default TotalAsset;
