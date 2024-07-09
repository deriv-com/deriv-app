import React from 'react';
import { Divider, Tooltip } from '@deriv-com/ui';
import { WalletText } from '../../../../components';
import InfoIcon from '../../../../public/images/ic-info-outline.svg';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS } from '../../constants';
import { ACCOUNT_ICONS, MARKET_TYPE_SHORTCODE } from './constants';
import './CompareAccountsTitleIcon.scss';

type TMarketType = THooks.AvailableMT5Accounts['market_type'];

type TCompareAccountsTitleIcon = {
    isDemo: boolean;
    marketType: TMarketType;
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const getAccountIcon = (platform: TPlatforms.All, marketType: TMarketType) => {
    if (platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER) {
        return ACCOUNT_ICONS[platform];
    }
    return (marketType && ACCOUNT_ICONS[marketType]) || ACCOUNT_ICONS.default;
};

type TMarketWithShortCode = `${TMarketType}_${string}`;

const getAccountCardTitle = (shortCode: TMarketWithShortCode | TPlatforms.OtherAccounts, isDemo?: boolean) => {
    switch (shortCode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
            return isDemo ? 'Standard Demo' : 'Standard - SVG';
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
            return 'Standard - BVI';
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
            return 'Standard - Vanuatu';
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
            return isDemo ? 'Deriv cTrader Demo' : 'Deriv cTrader';
        default:
            return isDemo ? 'CFDs Demo' : 'CFDs';
    }
};

const CompareAccountsTitleIcon = ({ isDemo, marketType, platform, shortCode }: TCompareAccountsTitleIcon) => {
    const marketTypeShortCode: TMarketWithShortCode = `${marketType}_${shortCode}`;
    const jurisdictionCardIcon = getAccountIcon(platform, marketType);

    const jurisdictionCardTitle =
        platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER
            ? getAccountCardTitle(platform, isDemo)
            : getAccountCardTitle(marketTypeShortCode, isDemo);
    const labuanJurisdictionMessage =
        'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.';

    return (
        <React.Fragment>
            <div className='wallets-compare-accounts-title'>
                {jurisdictionCardIcon}
                <div className='wallets-compare-accounts-title__separator'>
                    <WalletText align='center' as='h1' size='sm' weight='bold'>
                        {jurisdictionCardTitle}
                    </WalletText>
                    {marketTypeShortCode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN && (
                        <Tooltip
                            as='div'
                            tooltipContainerClassName='wallets-compare-accounts-title__tooltip'
                            tooltipContent={labuanJurisdictionMessage}
                            tooltipPosition='bottom-start'
                        >
                            <InfoIcon />
                        </Tooltip>
                    )}
                </div>
            </div>
            <Divider color='var(--general-main-3)' height={0.5} margin='0.4rem 2.8rem' />
        </React.Fragment>
    );
};

export default CompareAccountsTitleIcon;
