import React, { useRef } from 'react';
import { useHover } from 'usehooks-ts';
import { Text, Tooltip, useBreakpoint } from '@deriv/quill-design';
import InfoIcon from '../../../../public/images/ic-info-outline.svg';
import { THooks, TPlatforms } from '../../../../types';
import { CFDPlatforms, getAccountCardTitle } from '../../constants';
import { ACCOUNT_ICONS, MARKET_TYPE_SHORTCODE } from './constants';
import TradingPlatformIcons from './tradingPlatformIcons';

type TMarketType = THooks.AvailableMT5Accounts['market_type'];

type TCompareAccountsTitleIcon = {
    isDemo: boolean;
    marketType: TMarketType;
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const getAccountIcon = (platform: TPlatforms.All, marketType: TMarketType) => {
    if (platform === CFDPlatforms.DXTRADE || platform === CFDPlatforms.CTRADER) {
        return ACCOUNT_ICONS[platform];
    }
    return (marketType && ACCOUNT_ICONS[marketType]) || ACCOUNT_ICONS.default;
};

type TMarketWithShortCode = `${TMarketType}_${string}`;

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
        <React.Fragment>
            <div className={'flex flex-col gap-[5px] pt-1000 items-center'}>
                <TradingPlatformIcon height={48} width={48} />
                <div className='flex items-center gap-400'>
                    <Text bold size='sm'>
                        {jurisdictionCardTitle}
                    </Text>
                    {marketTypeShortCode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN && (
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
        </React.Fragment>
    );
};

export default CompareAccountsTitleIcon;
