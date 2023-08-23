import React, { useEffect } from 'react';
import { Text, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import BalanceText from 'Components/elements/text/balance-text';
import { observer, useStore } from '@deriv/stores';
import './asset-summary.scss';
import TotalAssetsLoader from 'Components/pre-loader/total-assets-loader';
import { useTotalAsset } from '@deriv/hooks';

const AssetSummary = observer(() => {
    const { traders_hub, client, common } = useStore();
    const { selected_account_type, is_eu_user, no_CR_account, no_MF_account } = traders_hub;
    const { is_logging_in, is_switching } = client;
    const { current_language } = common;
    const has_active_related_deriv_account = !((no_CR_account && !is_eu_user) || (no_MF_account && is_eu_user)); // if selected region is non-eu, check active cr accounts, if selected region is eu- check active mf accounts
    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;

    const total_asset = useTotalAsset();

    const [delayed_total_asset, setDelayedTotalAsset] = React.useState(total_asset);

    useEffect(() => {
        setDelayedTotalAsset(old => {
            if (!old) return total_asset;

            const delay = Math.abs(total_asset.last_updated - old.last_updated);
            if (delay >= 20) {
                return total_asset;
            }

            return old;
        });
    }, [total_asset]);

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
                        <Text align='right' key={`asset-summary--key-${current_language}`} size='xs' line_height='s'>
                            {localize('Total assets')}
                        </Text>
                    ) : null}
                    <Popover
                        alignment={isMobile() ? 'top' : 'left'}
                        message={localize('Total assets in all your accounts')}
                        zIndex={9999}
                        is_bubble_hover_enabled
                    >
                        <BalanceText
                            currency={delayed_total_asset.total_asset_currency}
                            balance={delayed_total_asset.total_asset_balance}
                            underline_style='dotted'
                        />
                    </Popover>
                </React.Fragment>
            ) : null}
        </div>
    );
});

export default AssetSummary;
