import React, { Fragment, useRef } from 'react';
import { useHover } from 'usehooks-ts';
import { Text, useBreakpoint } from '@deriv/quill-design';
import { Tooltip } from '../../../../components';
import InfoIcon from '../../../../public/images/ic-info-outline.svg';
import { THooks, TPlatforms } from '../../../../types';
import { CFDPlatforms } from '../../constants';
import { AccountIcons, MarketTypeShortcode } from './constants';
import TradingPlatformIcons from './tradingPlatformIcons';

type TMarketType = THooks.AvailableMT5Accounts['market_type'];

type TCompareAccountsTitleIcon = {
    isDemo: boolean;
    marketType: TMarketType;
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

type TMarketWithShortCode = `${TMarketType}_${string}`;

const getAccountIcon = (platform: TPlatforms.All, marketType: TMarketType) => {
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

const CompareAccountsTitleIcon = ({ isDemo, marketType, platform, shortCode }: TCompareAccountsTitleIcon) => {
    const marketTypeShortCode: TMarketWithShortCode = `${marketType}_${shortCode}`;
    const jurisdictionCardIcon = getAccountIcon(platform, marketType);

    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);
    const { isDesktop } = useBreakpoint();

    const jurisdictionCardTitle =
        platform === CFDPlatforms.DXTRADE || platform === CFDPlatforms.CTRADER
            ? getAccountCardTitle(platform, isDemo)
            : getAccountCardTitle(marketTypeShortCode, isDemo);
    const labuanJurisdictionMessage =
        'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.';

    const TradingPlatformIcon = TradingPlatformIcons[jurisdictionCardIcon];

    return (
        <Fragment>
            <div className={'flex flex-col gap-[5px] pt-1000 items-center'}>
                <TradingPlatformIcon height={48} width={48} />
                <div className='flex items-center gap-400'>
                    <Text bold size='sm'>
                        {jurisdictionCardTitle}
                    </Text>
                    {marketTypeShortCode === MarketTypeShortcode.FINANCIAL_LABUAN && (
                        <Tooltip
                            alignment='bottom'
                            className='-translate-x-[80%]'
                            isVisible={isHovered && isDesktop}
                            message={labuanJurisdictionMessage}
                        >
                            <div ref={hoverRef}>
                                <InfoIcon />
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>
            <hr className='w-[213px] border-t-[5px] border-solid border-system-light-less-prominent-text' />
        </Fragment>
    );
};

export default CompareAccountsTitleIcon;
