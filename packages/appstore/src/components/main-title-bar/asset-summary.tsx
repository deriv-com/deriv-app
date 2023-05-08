import React from 'react';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import BalanceText from 'Components/elements/text/balance-text';
import { observer, useStore } from '@deriv/stores';
import './asset-summary.scss';
import TotalAssetsLoader from 'Components/pre-loader/total-assets-loader';
import { useTotalAccountBalance, useCfdAccounts, usePlatformAccounts } from '@deriv/hooks';

const AssetSummary = observer(() => {
    const { traders_hub, client } = useStore();
    const { selected_account_type, is_eu_user, no_CR_account, no_MF_account } = traders_hub;
    const { is_logging_in, is_switching, default_currency } = client;
    const { real: platform_real_accounts, demo: platform_demo_account } = usePlatformAccounts();
    const { real: cfd_real_accounts, demo: cfd_demo_accounts } = useCfdAccounts();
    const platform_real_balance = useTotalAccountBalance(platform_real_accounts);
    const cfd_real_balance = useTotalAccountBalance(cfd_real_accounts);
    const cfd_demo_balance = useTotalAccountBalance(cfd_demo_accounts);
    const is_real = selected_account_type === 'real';
    const real_total_balance = platform_real_balance.balance + cfd_real_balance.balance;
    const demo_total_balance = (platform_demo_account?.balance || 0) + cfd_demo_balance.balance;

    const has_active_related_deriv_account = !((no_CR_account && !is_eu_user) || (no_MF_account && is_eu_user)); // if selected region is non-eu, check active cr accounts, if selected region is eu- check active mf accounts
    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;

    //dont show loader if user has no respective regional account
    if ((is_switching || is_logging_in) && (eu_account || cr_account)) {
        return (
            <React.Fragment>
                <div className='asset-summary__container content-loader'>
                    <TotalAssetsLoader />
                </div>
            </React.Fragment>
        );
    }

    return (
        <div className='asset-summary'>
            {has_active_related_deriv_account || selected_account_type === 'demo' ? (
                <React.Fragment>
                    {!isMobile() ? (
                        <Text align='right' size='xs' line_height='s'>
                            {localize('Total asset')}
                        </Text>
                    ) : null}
                    <Popover
                        alignment={isMobile() ? 'top' : 'left'}
                        message={localize('Total assets in all your accounts')}
                        zIndex={9999}
                        is_bubble_hover_enabled
                    >
                        <BalanceText
                            currency={
                                is_real
                                    ? platform_real_balance.currency
                                    : platform_demo_account?.currency || default_currency
                            }
                            balance={is_real ? real_total_balance : demo_total_balance}
                            underline_style='dotted'
                        />
                    </Popover>
                </React.Fragment>
            ) : null}
        </div>
    );
});

export default AssetSummary;
