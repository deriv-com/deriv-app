import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import BalanceText from 'Components/elements/text/balance-text';
import { useStores } from 'Stores';
import './asset-summary.scss';

const AssetSummary = () => {
    const { client, traders_hub } = useStores();
    const { has_active_real_account, is_eu } = client;
    const { selected_account_type, platform_real_balance, cfd_demo_balance, platform_demo_balance, cfd_real_balance } =
        traders_hub;

    const getTotalBalance = () => {
        if (selected_account_type === 'real') {
            return {
                balance: platform_real_balance.balance + cfd_real_balance.balance,
                currency: platform_real_balance.currency,
            };
        }

        return {
            balance: platform_demo_balance.balance + cfd_demo_balance.balance,
            currency: platform_demo_balance.currency,
        };
    };

    const is_eu_popover_text = is_eu
        ? localize(`Total assets in your Multipliers and DMT5 ${selected_account_type} accounts`)
        : localize(`Total assets in your Options, Deriv MT5 and Deriv X ${selected_account_type} accounts`);

    return (
        <div className='asset-summary'>
            {has_active_real_account || selected_account_type === 'demo' ? (
                <React.Fragment>
                    {!isMobile() ? (
                        <Text align='right' size='xs' line_height='s'>
                            {localize('Total assets')}
                        </Text>
                    ) : null}
                    <Popover alignment='left' message={is_eu_popover_text}>
                        <BalanceText
                            currency={getTotalBalance().currency}
                            balance={getTotalBalance().balance}
                            underline_style='dotted'
                        />
                    </Popover>
                </React.Fragment>
            ) : null}
        </div>
    );
};

export default observer(AssetSummary);
