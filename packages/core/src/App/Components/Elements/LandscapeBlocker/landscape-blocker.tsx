import React from 'react';
import { useLocation } from 'react-router-dom';
import { isDisabledLandscapeBlockerRoute, isTabletOs, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import LandscapeBlockerSvg from 'Assets/SvgComponents/settings/landscape-blocker.svg';
import './landscape-blocker.scss';

const LandscapeBlocker = observer(() => {
    // need to check for wallet account and don't hide landscape blocker for users migrated to wallets
    const {
        client: { has_wallet },
    } = useStore();
    const location = useLocation();
    const pathname = location?.pathname;
    const is_hidden_landscape_blocker = isDisabledLandscapeBlockerRoute(pathname);
    const shouldShowDtraderTabletView = pathname === routes.trade && isTabletOs;

    if (!has_wallet && (is_hidden_landscape_blocker || shouldShowDtraderTabletView)) return null;

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
