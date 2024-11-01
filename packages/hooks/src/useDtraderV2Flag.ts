import { useState, useEffect } from 'react';
import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';
import { isDTraderV2, routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { Analytics } from '@deriv-com/analytics';

const useDtraderV2Flag = () => {
    const { isGBLoaded: is_growthbook_loaded, isGBAvailable: is_gb_available } = useIsGrowthbookIsLoaded();
    const load_dtrader_module = is_growthbook_loaded || !is_gb_available;

    const is_dtrader_v2 = isDTraderV2();
    const { isMobile: is_mobile } = useDevice();
    const is_feature_flag_active = Boolean(Analytics?.getFeatureValue('dtrader_v2_enabled', false));
    const is_trade_or_contract_path =
        location.pathname.startsWith(routes.trade) || location.pathname.startsWith('/contract/');

    const [dtrader_v2_enabled, setDTraderV2Enabled] = useState(false);
    useEffect(() => {
        if (is_growthbook_loaded || isDTraderV2()) {
            setDTraderV2Enabled((is_dtrader_v2 || is_feature_flag_active) && is_mobile && is_trade_or_contract_path);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_mobile, is_growthbook_loaded]);

    return { dtrader_v2_enabled, load_dtrader_module };
};

export default useDtraderV2Flag;
