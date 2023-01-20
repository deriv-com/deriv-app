import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile, ContentFlag } from '@deriv/shared';
import BalanceText from 'Components/elements/text/balance-text';
import { useStores } from 'Stores';
import './asset-summary.scss';

const AssetSummary = () => {
    const { client, traders_hub } = useStores();
    const { has_active_real_account } = client;
    const {
        selected_account_type,
        platform_real_balance,
        cfd_demo_balance,
        platform_demo_balance,
        cfd_real_balance,
        content_flag,
        is_eu_user,
    } = traders_hub;

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

    const eu_text = content_flag === ContentFlag.EU_REAL || is_eu_user;

    const is_eu_popover_text = eu_text
        ? localize(`Total assets in your Multipliers and Deriv MT5 ${selected_account_type} accounts`)
        : localize(
              `Total assets in your Options & Multipliers, Deriv MT5 and Deriv X ${selected_account_type} accounts`
          );

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
