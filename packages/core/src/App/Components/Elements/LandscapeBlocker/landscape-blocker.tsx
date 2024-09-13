import React from 'react';
import { useLocation } from 'react-router-dom';
import { isDisabledLandscapeBlockerRoute, isMobileOs, isTabletOs, routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import LandscapeBlockerSvg from 'Assets/SvgComponents/settings/landscape-blocker.svg';
import './landscape-blocker.scss';
import { useDevice } from '@deriv-com/ui';

const LandscapeBlocker = observer(() => {
    const { isMobile } = useDevice();
    const location = useLocation();
    const pathname = location?.pathname;
    const is_hidden_landscape_blocker = isDisabledLandscapeBlockerRoute(pathname);
    const should_show_dtrader_tablet_view = pathname === routes.trade && isTabletOs;
    const show_blocker_on_mobile_landscape_view =
        !isMobile &&
        isMobileOs() &&
        (pathname.startsWith(routes.trade) ||
            pathname.startsWith(routes.reports) ||
            pathname.startsWith(routes.bot) ||
            pathname.startsWith('/contract'));

    if (!show_blocker_on_mobile_landscape_view && (is_hidden_landscape_blocker || should_show_dtrader_tablet_view))
        return null;

    return (
        <div id='landscape_blocker' className='landscape-blocker'>
            <div className='landscape-blocker__icon'>
                <LandscapeBlockerSvg />
            </div>
            <div className='landscape-blocker__message--landscape'>
                Please adjust your screen size for optimal viewing.
            </div>
            <div className='landscape-blocker__message--portrait'>
                Please adjust your <br />
                screen size for <br />
                optimal viewing.
            </div>
        </div>
    );
});

export default LandscapeBlocker;
