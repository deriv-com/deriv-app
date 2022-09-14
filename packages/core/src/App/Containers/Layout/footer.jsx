import React from 'react';
import { PlatformContext } from '@deriv/shared';
import DefaultFooter from './default-footer';
import TradingHubFooter from './trading-hub-footer';

const Footer = () => {
    const { is_pre_appstore } = React.useContext(PlatformContext);
    if (is_pre_appstore) {
        return <TradingHubFooter />;
    }
    return <DefaultFooter />;
};

export default Footer;
