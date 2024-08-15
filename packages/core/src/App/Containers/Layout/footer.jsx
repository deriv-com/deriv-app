import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { routes, isDisabledLandscapeBlockerRoute } from '@deriv/shared';
import { DesktopWrapper } from '@deriv/components';
import TradingHubFooter from './trading-hub-footer';

const Footer = () => {
    const { isDesktop, isTablet } = useDevice();
    const { pathname } = useLocation();
    const is_hidden_landscape_blocker = isDisabledLandscapeBlockerRoute(pathname);
    const is_dtrader_route = pathname === routes.trade;
    const show_in_tablet_routes = [routes.contract];

    if (pathname === routes.onboarding) {
        return null;
    }

    if (is_hidden_landscape_blocker || is_dtrader_route) {
        if (isDesktop) return <TradingHubFooter />;
        if (isTablet && show_in_tablet_routes.includes(pathname)) return <TradingHubFooter />;
        return null;
    }

    return (
        <DesktopWrapper>
            <TradingHubFooter />
        </DesktopWrapper>
    );
};

export default Footer;
