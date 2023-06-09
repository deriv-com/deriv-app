import React from 'react';
import { Text } from '@deriv/components';
import { TTradingPlatformAvailableAccount } from 'Components/props.types';
import { getMarketType, getPlatformLabel } from '../../Helpers/compare-accounts-config';

type TCFDCompareAccountsPlatformLabelProps = {
    trading_platforms: TTradingPlatformAvailableAccount;
};

const CFDCompareAccountsPlatformLabel: React.FC<TCFDCompareAccountsPlatformLabelProps> = ({ trading_platforms }) => {
    const market_type = getMarketType(trading_platforms);
    const platform_label = getPlatformLabel(market_type);

    return (
        <div className={'compare-cfd-account-platform-label'}>
            <Text as='p' weight='bold' size='xxxs' align='center' color='blue'>
                {platform_label}
            </Text>
        </div>
    );
};

export default CFDCompareAccountsPlatformLabel;
