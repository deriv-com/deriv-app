import React from 'react';
import { Icon } from '@deriv/components';
import { routes } from '@deriv/shared';
import { CFD_PLATFORMS, PRODUCT } from '../Helpers/cfd-config';
import TradingPlatformIcon from '../Assets/svgs/trading-platform';
import { TProducts } from '../Components/props.types';

type TCFDPasswordSuccessIconProps = {
    platform: string;
    type?: string;
    show_eu_related_content: boolean;
    product?: TProducts;
};

const CFDPasswordSuccessIcon = ({ platform, type, show_eu_related_content, product }: TCFDPasswordSuccessIconProps) => {
    const traders_hub = window.location.pathname === routes.traders_hub;
    if (platform === CFD_PLATFORMS.DXTRADE) {
        return <Icon icon='IcRebrandingDxtradeDashboard' size={128} />;
    } else if (traders_hub) {
        if (platform === CFD_PLATFORMS.CTRADER) {
            return <TradingPlatformIcon icon='CTrader' size={128} />;
        }
        switch (type) {
            case 'synthetic':
                return <TradingPlatformIcon icon='Standard' size={128} />;
            case 'all':
                if (product === PRODUCT.ZEROSPREAD) {
                    return <TradingPlatformIcon icon='ZeroSpread' size={128} />;
                }
                return <TradingPlatformIcon icon='SwapFree' size={128} />;
            case 'financial':
                if (show_eu_related_content) {
                    return <TradingPlatformIcon icon='CFDs' size={128} />;
                }
                return <TradingPlatformIcon icon='Financial' size={128} />;
            default:
                return <TradingPlatformIcon icon='Financial' size={128} />;
        }
    } else {
        switch (type) {
            case 'synthetic':
                return <Icon icon='IcMt5StandardPlatform' size={128} />;
            case 'all':
                if (product === PRODUCT.ZEROSPREAD) {
                    return <Icon icon='IcMt5ZeroSpread' size={128} />;
                }
                return <Icon icon='IcMt5SwapFreePlatform' size={128} />;
            case 'financial':
                if (show_eu_related_content) {
                    return <Icon icon='IcMt5CfdPlatform' size={128} />;
                }
                return <Icon icon='IcMt5FinancialPlatform' size={128} />;
            default:
                return <Icon icon='IcMt5FinancialStpPlatform' size={128} />;
        }
    }
};
export default CFDPasswordSuccessIcon;
