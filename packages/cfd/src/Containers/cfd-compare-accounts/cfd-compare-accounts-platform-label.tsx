import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { TCompareAccountsCard } from 'Components/props.types';
import {
    getPlatformLabel,
    getHeaderColor,
    getMarketType,
    platfromsHeaderLabel,
} from '../../Helpers/compare-accounts-config';

const CFDCompareAccountsPlatformLabel = ({ trading_platforms, is_eu_user }: TCompareAccountsCard) => {
    const market_type = getMarketType(trading_platforms);
    const jurisdiction_shortcode = market_type.concat('_', trading_platforms.shortcode);

    const platform_label =
        !is_eu_user && jurisdiction_shortcode !== 'financial_maltainvest'
            ? getPlatformLabel(trading_platforms.platform)
            : getPlatformLabel('CFDs');
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
