import React from 'react';
import { routes } from '@deriv/shared';
import DefaultFooter from './default-footer';
import TradingHubFooter from './trading-hub-footer';
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const { pathname } = useLocation();
    if (pathname !== routes.onboarding) {
        return <TradingHubFooter />;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return <DefaultFooter />;
};

export default Footer;
