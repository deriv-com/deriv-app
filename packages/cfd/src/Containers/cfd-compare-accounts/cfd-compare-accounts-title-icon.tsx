import React from 'react';
import { Text } from '@deriv/components';
import TradigPlatformIconProps from '../../Assets/svgs/trading-platform';
import { TTradingPlatformAvailableAccount } from 'Components/props.types';
import { getAccountCardTitle, getMarketType, getAccountIcon } from '../../Helpers/compare-accounts-config';

type TCFDCompareAccountTitleIconProps = {
    trading_platforms: TTradingPlatformAvailableAccount;
};

const CFDCompareAccountTitleIcon: React.FC<TCFDCompareAccountTitleIconProps> = ({ trading_platforms }) => {
    const market_type = getMarketType(trading_platforms);
    const jurisdiction_shortcode = market_type.concat('_', trading_platforms.shortcode);
    const jurisdiction_card_icon = getAccountIcon(market_type);
    const jurisdiction_card_title = getAccountCardTitle(jurisdiction_shortcode);
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

export default CFDCompareAccountTitleIcon;
