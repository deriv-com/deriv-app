import React from 'react';
import { observer, useStore } from '@deriv/stores';
import './asset-summary.scss';
import TotalAssetsLoader from 'Components/pre-loader/total-assets-loader';
import TotalAsset from './total-asset';
import { useExchangeRate } from '@deriv/hooks';
import { useMT5LoginList } from '@deriv/api';

const AssetSummary = observer(() => {
    const { last_update } = useExchangeRate();
    const { traders_hub, client } = useStore();
    const { is_eu_user, no_CR_account, no_MF_account } = traders_hub;
    const { is_logging_in, is_switching, is_landing_company_loaded } = client;
    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;
    const { data: mt5_login_list } = useMT5LoginList();

    const is_mt5_account_available = React.useMemo(() => {
        return mt5_login_list !== undefined;
    }, [mt5_login_list]);

    //dont show loader if user has no respective regional account
    if (
        ((is_switching || is_logging_in) && (eu_account || cr_account)) ||
        !is_landing_company_loaded ||
        !last_update ||
        !is_mt5_account_available
    ) {
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
