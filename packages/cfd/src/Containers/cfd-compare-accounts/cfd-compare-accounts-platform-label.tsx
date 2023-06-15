import React from 'react';
import { Text } from '@deriv/components';
import classNames from 'classnames';
import { TModifiedTradingPlatformAvailableAccount } from 'Components/props.types';
import { getPlatformLabel, getHeaderColor, platfromsHeaderLabel } from '../../Helpers/compare-accounts-config';

type TCFDCompareAccountsPlatformLabelProps = {
    trading_platforms: TModifiedTradingPlatformAvailableAccount;
};

const CFDCompareAccountsPlatformLabel = ({ trading_platforms }: TCFDCompareAccountsPlatformLabelProps) => {
    const platform_label = getPlatformLabel(trading_platforms.platform || '');
    const header_color = getHeaderColor(platform_label);

    return (
        <div
            className={classNames('compare-cfd-account-platform-label', {
                'compare-cfd-account-platform-label--other-cfds': platform_label === platfromsHeaderLabel.other_cfds,
            })}
        >
            <Text as='p' weight='bold' size='xxxs' align='center' color={header_color}>
                {platform_label}
            </Text>
        </div>
    );
};

export default CFDCompareAccountsPlatformLabel;
