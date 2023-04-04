import React from 'react';
import { connect } from 'Stores/connect';
import { routes } from '@deriv/shared';
import DefaultFooter from './default-footer';
import TradingHubFooter from './trading-hub-footer';
import { useLocation } from 'react-router-dom';

const Footer = ({ is_pre_appstore }) => {
    const { pathname } = useLocation();
    if (is_pre_appstore && pathname !== routes.onboarding) {
        return <TradingHubFooter />;
    } else if (pathname === routes.onboarding) {
        return null;
    }
    return <DefaultFooter />;
};

export default connect(({ client }) => ({
    is_pre_appstore: client.is_pre_appstore,
}))(Footer);
