import React from 'react';
import { Text } from '@deriv/components';
import TradigPlatformIconProps from '../../Assets/svgs/trading-platform';
import { TModifiedTradingPlatformAvailableAccount } from 'Components/props.types';
import { getAccountCardTitle, getMarketType, getAccountIcon } from '../../Helpers/compare-accounts-config';

type TCFDCompareAccountsTitleIconProps = {
    trading_platforms: TModifiedTradingPlatformAvailableAccount;
};

const CFDCompareAccountsTitleIcon: React.FC<TCFDCompareAccountsTitleIconProps> = ({ trading_platforms }) => {
    const market_type = getMarketType(trading_platforms);
    const jurisdiction_shortcode = market_type.concat('_', trading_platforms.shortcode);
    const jurisdiction_card_icon =
        trading_platforms.platform === 'dxtrade'
            ? getAccountIcon(trading_platforms.platform)
            : getAccountIcon(market_type);
    const jurisdiction_card_title =
        trading_platforms.platform === 'dxtrade'
            ? getAccountCardTitle(trading_platforms.platform)
            : getAccountCardTitle(jurisdiction_shortcode);

    const icon_size = 48;
    return (
        <div className={'compare-cfd-account-icon-title'}>
            <TradigPlatformIconProps icon={jurisdiction_card_icon} size={icon_size} />
            <Text as='h1' weight='bold' size='xs' align='center'>
                {jurisdiction_card_title}
            </Text>
        </div>
    );
};

export default CFDCompareAccountsTitleIcon;
