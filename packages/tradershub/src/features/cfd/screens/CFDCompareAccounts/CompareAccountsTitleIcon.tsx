import React, { Fragment, useRef } from 'react';
import InfoIcon from '@/assets/svgs/ic-info-outline.svg';
import { IconComponent } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { THooks, TPlatforms } from '@/types';
import { CFDPlatforms } from '@cfd/constants';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Divider, Text, Tooltip, useDevice } from '@deriv-com/ui';
import { AccountIcons, MarketTypeShortcode } from './constants';

type TMarketType = THooks.AvailableMT5Accounts['market_type'];

type TCompareAccountsTitleIcon = {
    marketType: TMarketType;
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

type TMarketWithShortCode = `${TMarketType}_${string}`;

const getAccountIcon = (platform: TPlatforms.All, marketType: TMarketType, isEU: boolean) => {
    if (isEU) {
        return AccountIcons.default;
    }
    if (platform === CFDPlatforms.DXTRADE || platform === CFDPlatforms.CTRADER) {
        return AccountIcons[platform];
    }
    return (marketType && AccountIcons[marketType]) || AccountIcons.default;
};

const getAccountCardTitle = (shortCode: TMarketWithShortCode | TPlatforms.OtherAccounts, isDemo?: boolean) => {
    switch (shortCode) {
        case MarketTypeShortcode.SYNTHETIC_SVG:
            return isDemo ? 'Derived Demo' : 'Derived - SVG';
        case MarketTypeShortcode.SYNTHETIC_BVI:
            return 'Derived - BVI';
        case MarketTypeShortcode.SYNTHETIC_VANUATU:
            return 'Derived - Vanuatu';
        case MarketTypeShortcode.FINANCIAL_SVG:
            return isDemo ? 'Financial Demo' : 'Financial - SVG';
        case MarketTypeShortcode.FINANCIAL_BVI:
            return 'Financial - BVI';
        case MarketTypeShortcode.FINANCIAL_VANUATU:
            return 'Financial - Vanuatu';
        case MarketTypeShortcode.FINANCIAL_LABUAN:
            return 'Financial - Labuan';
        case MarketTypeShortcode.ALL_SVG:
            return isDemo ? 'Swap-Free Demo' : 'Swap-Free - SVG';
        case CFDPlatforms.DXTRADE:
            return isDemo ? 'Deriv X Demo' : 'Deriv X';
        case CFDPlatforms.CTRADER:
            return isDemo ? 'Deriv cTrader Demo' : 'Deriv cTrader';
        default:
            return isDemo ? 'CFDs Demo' : 'CFDs';
    }
};

const CompareAccountsTitleIcon = ({ marketType, platform, shortCode }: TCompareAccountsTitleIcon) => {
    const { data: activeDerivTrading } = useActiveTradingAccount();
    const isDemo = activeDerivTrading?.is_virtual;
    const marketTypeShortCode: TMarketWithShortCode = `${marketType}_${shortCode}`;
    const { isEU } = useRegulationFlags();
    const jurisdictionCardIcon = getAccountIcon(platform, marketType, isEU);

    const hoverRef = useRef(null);
    const { isDesktop } = useDevice();

    const jurisdictionCardTitle =
        platform === CFDPlatforms.DXTRADE || platform === CFDPlatforms.CTRADER
            ? getAccountCardTitle(platform, isDemo)
            : getAccountCardTitle(marketTypeShortCode, isDemo);
    const labuanJurisdictionMessage =
        'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.';

    return (
        <Fragment>
            <div className='flex flex-col items-center gap-5 pt-20 pb-5'>
                <IconComponent className='w-40 h-40 lg:w-48 lg:h-48' icon={jurisdictionCardIcon} />
                <div className='flex items-center gap-8'>
                    <Text size='sm' weight='bold'>
                        {jurisdictionCardTitle}
                    </Text>
                    {marketTypeShortCode === MarketTypeShortcode.FINANCIAL_LABUAN && (
                        <Tooltip
                            className='lg:-translate-x-[70%] -translate-x-[85%] text-sm lg:max-w-[200px] max-w-[150px]'
                            message={labuanJurisdictionMessage}
                            position='bottom'
                            triggerAction={isDesktop ? 'hover' : 'click'}
                        >
                            <div ref={hoverRef}>
                                <InfoIcon />
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>
            <Divider className='w-4/5 mx-auto' />
        </Fragment>
    );
};

export default CompareAccountsTitleIcon;
