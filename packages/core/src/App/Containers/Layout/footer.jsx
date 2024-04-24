import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { routes, isDisabledLandscapeBlockerRoute } from '@deriv/shared';
import { DesktopWrapper } from '@deriv/components';
import DefaultFooter from './default-footer';
import TradingHubFooter from './trading-hub-footer';

const Footer = () => {
    const { isDesktop, isTablet } = useDevice();
    const { pathname } = useLocation();
    const is_hidden_landscape_blocker = isDisabledLandscapeBlockerRoute(pathname);
    const show_in_tablet_routes = [routes.trade, routes.contract];

    if (pathname === routes.onboarding) {
        return null;
    }

    if (pathname !== routes.onboarding) {
        if (is_hidden_landscape_blocker) {
            if (isDesktop) return <TradingHubFooter />;
            if (isTablet && show_in_tablet_routes.includes(pathname)) return <TradingHubFooter />;
            return null;
        } return (
                <DesktopWrapper>
                    <TradingHubFooter />
                </DesktopWrapper>
            );
    }

    // this is unreachable code for now, but I didn't delete it.
    // because later we can change the conditions above and show default footer
    return (
        <DesktopWrapper>
            <DefaultFooter />
        </DesktopWrapper>
    );
};

export default Footer;
