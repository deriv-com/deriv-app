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
    if (platform === CFD_PLATFORMS.DXTRADE) {
        return <Icon icon='IcRebrandingDxtradeDashboard' size={128} />;
    } else if (platform === CFD_PLATFORMS.DERIVEZ) {
        return <Icon icon='IcBrandDerivEz' size={128} />;
    } else if (traders_hub) {
        switch (type) {
            case 'synthetic':
                return <TradingPlatformIcon icon='Derived' size={128} />;
            case 'all':
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
                return <Icon icon='IcMt5SyntheticPlatform' size={128} />;
            case 'all':
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

export default SuccessModalIcons;
