import React from 'react';
import { observer, useStore } from '@deriv/stores';
import './asset-summary.scss';
import TotalAssetsLoader from 'Components/pre-loader/total-assets-loader';
import TotalAsset from './total-asset';
import { useExchangeRate } from '@deriv/hooks';

const AssetSummary = observer(() => {
    const { rates } = useExchangeRate();
    const { traders_hub, client } = useStore();
    const { is_eu_user, no_CR_account, no_MF_account } = traders_hub;
    const { is_logging_in, is_switching } = client;

    // if selected region is non-eu, check active cr accounts, if selected region is eu- check active mf accounts
    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;

    //dont show loader if user has no respective regional account
    if (((is_switching || is_logging_in) && (eu_account || cr_account)) || !rates) {
        return (
            <React.Fragment>
                <div className='asset-summary__container content-loader'>
                    <TotalAssetsLoader />
                </div>
            </React.Fragment>
        );
    }

    return <TotalAsset />;
});

export default AssetSummary;
