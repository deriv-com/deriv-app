import React, { useRef } from 'react';
import { useHover } from 'usehooks-ts';
import { Tooltip, WalletText } from '../../../../components';
import InfoIcon from '../../../../public/images/ic-info-outline.svg';
import TradingPlatformIcons from '../../../../public/images/tradingPlatforms';
import { CFD_PLATFORMS, MARKET_TYPE, MARKET_TYPE_SHORTCODE } from './constants';
import './CompareAccountsTitleIcon.scss';

type TPlatforms = typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];
// type TShortCode = 'bvi' | 'labuan' | 'maltainvest' | 'svg' | 'vanuatu';
type TMarketType = typeof MARKET_TYPE[keyof typeof MARKET_TYPE];

type TCompareAccountsTitleIcon = {
    isDemo: boolean;
    isEuUser: boolean;
    marketType: TMarketType;
    platform: TPlatforms;
    shortCode: string;
};

const accountIcon = {
    [MARKET_TYPE.SYNTHETIC]: 'Derived',
    [MARKET_TYPE.FINANCIAL]: 'Financial',
    [MARKET_TYPE.ALL]: 'SwapFree',
    [CFD_PLATFORMS.DXTRADE]: 'DerivX',
    [CFD_PLATFORMS.CTRADER]: 'CTrader',
    default: 'CFDs',
} as const;

const getAccountIcon = (platform: TPlatforms, marketType: TMarketType) => {
    if (platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER) {
        return accountIcon[platform];
    }
    return (marketType && accountIcon[marketType]) || accountIcon.default;
};

type TMarketWithShortCode = `${TMarketType}_${string}`;

const getAccountCardTitle = (shortCode: TMarketWithShortCode | TPlatforms, isDemo?: boolean) => {
    switch (shortCode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
            return isDemo ? 'Derived Demo' : 'Derived - SVG';
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
            return 'Derived - BVI';
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
            return 'Derived - Vanuatu';
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
            return isDemo ? 'Financial Demo' : 'Financial - SVG';
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return 'Financial - BVI';
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return 'Financial - Vanuatu';
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return 'Financial - Labuan';
        case MARKET_TYPE_SHORTCODE.ALL_SVG:
            return isDemo ? 'Swap-Free Demo' : 'Swap-Free - SVG';
        case CFD_PLATFORMS.DXTRADE:
            return isDemo ? 'Deriv X Demo' : 'Deriv X';
        case CFD_PLATFORMS.CTRADER:
            return isDemo ? 'cTrader Demo' : 'cTrader';
        default:
            return isDemo ? 'CFDs Demo' : 'CFDs';
    }
};

const CompareAccountsTitleIcon = ({ isDemo, isEuUser, marketType, platform, shortCode }: TCompareAccountsTitleIcon) => {
    // const marketType = !isEuUser ? tradingPlatform.market_type : 'CFDs';
    // const marketTypeShortCode = marketType.concat('_', shortCode);
    const marketTypeShortCode: TMarketWithShortCode = `${marketType}_${shortCode}`;
    const jurisdictionCardIcon = getAccountIcon(platform, marketType);

    const hoverRef = useRef(null);
    const isHovered = useHover(hoverRef);

    const jurisdictionCardTitle =
        platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER
            ? getAccountCardTitle(platform, isDemo)
            : getAccountCardTitle(marketTypeShortCode, isDemo);
    const labuanJurisdictionMessage =
        'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.';

    const TradingPlatformIcon = TradingPlatformIcons[jurisdictionCardIcon];

    return (
        <React.Fragment>
            <div className={'wallets-compare-accounts-icon-title'}>
                <TradingPlatformIcon height={48} width={48} />
                <div className='wallets-compare-accounts-icon-title__separator'>
                    <WalletText align='center' as='h1' size='sm' weight='bold'>
                        {jurisdictionCardTitle}
                    </WalletText>
                    {marketTypeShortCode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN && (
                        <Tooltip
                            alignment='bottom'
                            className='wallets-compare-accounts-tooltip'
                            isVisible={isHovered}
                            message={labuanJurisdictionMessage}
                        >
                            <div ref={hoverRef}>
                                <InfoIcon />
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>
            <hr className='wallets-compare-accounts-underline' />
        </React.Fragment>
    );
};

export default CompareAccountsTitleIcon;
