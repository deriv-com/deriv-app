import { useEffect, useState } from 'react';

import { isDtraderV2DesktopEnabled, isDtraderV2MobileEnabled } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';

import useIsGrowthbookIsLoaded from './useIsGrowthbookLoaded';

const useDtraderV2Flag = () => {
    const { isGBLoaded: is_growthbook_loaded, isGBAvailable: is_gb_available } = useIsGrowthbookIsLoaded();
    const load_dtrader_module = is_growthbook_loaded || !is_gb_available;

    const { isMobile: is_mobile, isDesktop: is_desktop } = useDevice();
    const is_dtrader_v2_mobile = isDtraderV2MobileEnabled(is_mobile);
    const is_dtrader_v2_desktop = isDtraderV2DesktopEnabled(is_desktop);

    const [dtrader_v2_enabled_mobile, setDtraderV2EnabledMobile] = useState(false);
    const [dtrader_v2_enabled_desktop, setDtraderV2EnabledDesktop] = useState(false);

    useEffect(() => {
        if (is_growthbook_loaded || is_dtrader_v2_mobile) {
            setDtraderV2EnabledMobile(is_dtrader_v2_mobile);
        }
        if (is_growthbook_loaded || is_dtrader_v2_desktop) {
            setDtraderV2EnabledDesktop(is_dtrader_v2_desktop);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_mobile, is_growthbook_loaded]);

    return { dtrader_v2_enabled_mobile, dtrader_v2_enabled_desktop, load_dtrader_module };
};

export default useDtraderV2Flag;
