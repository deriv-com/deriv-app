import { useState, useEffect } from 'react';
import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';
import { isDTraderV2, routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { Analytics } from '@deriv-com/analytics';

const useDtraderV2Flag = () => {
    const { isGBLoaded: is_growthbook_loaded, isGBAvailable: is_gb_available } = useIsGrowthbookIsLoaded();
    const load_dtrader_module = is_growthbook_loaded || !is_gb_available;
    const [dtrader_v2_enabled, setDTraderV2Enabled] = useState(false);
    const { isMobile } = useDevice();
    useEffect(() => {
        if (is_growthbook_loaded || isDTraderV2()) {
            setDTraderV2Enabled(
                (isDTraderV2() || Boolean(Analytics?.getFeatureValue('dtrader_v2_enabled', false))) &&
                    isMobile &&
                    (location.pathname.startsWith(routes.trade) || location.pathname.startsWith('/contract/'))
            );
        }
    }, [isMobile, is_growthbook_loaded]);

    return { dtrader_v2_enabled, load_dtrader_module };
};

export default useDtraderV2Flag;
