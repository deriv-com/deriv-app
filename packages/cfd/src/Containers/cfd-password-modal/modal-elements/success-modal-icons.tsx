import React from 'react';
import { Icon } from '@deriv/components';
import { CFD_PLATFORMS, routes } from '@deriv/shared';
import TradingPlatformIcon from '../../../Assets/svgs/trading-platform';

type TSuccessModalIconsProps = {
    platform: string;
    type?: string;
    show_eu_related_content: boolean;
};

const SuccessModalIcons = ({ platform, type, show_eu_related_content }: TSuccessModalIconsProps) => {
    const traders_hub = window.location.pathname === routes.traders_hub;
    const icon_size = 128;
    if (platform === CFD_PLATFORMS.DXTRADE) {
        return <Icon icon='IcRebrandingDxtradeDashboard' size={icon_size} />;
    } else if (platform === CFD_PLATFORMS.DERIVEZ) {
        return <Icon icon='IcBrandDerivEz' size={icon_size} />;
    } else if (traders_hub) {
        switch (type) {
            case 'synthetic':
                return <TradingPlatformIcon icon='Derived' size={icon_size} />;
            case 'all':
                return <TradingPlatformIcon icon='SwapFree' size={icon_size} />;
            case 'financial':
                if (show_eu_related_content) {
                    return <TradingPlatformIcon icon='CFDs' size={icon_size} />;
                }
                return <TradingPlatformIcon icon='Financial' size={icon_size} />;
            default:
                return <TradingPlatformIcon icon='Financial' size={icon_size} />;
        }
    } else {
        switch (type) {
            case 'synthetic':
                return <Icon icon='IcMt5SyntheticPlatform' size={icon_size} />;
            case 'all':
                return <Icon icon='IcMt5SwapFreePlatform' size={icon_size} />;
            case 'financial':
                if (show_eu_related_content) {
                    return <Icon icon='IcMt5CfdPlatform' size={icon_size} />;
                }
                return <Icon icon='IcMt5FinancialPlatform' size={icon_size} />;
            default:
                return <Icon icon='IcMt5FinancialStpPlatform' size={icon_size} />;
        }
    }
};

export default SuccessModalIcons;
