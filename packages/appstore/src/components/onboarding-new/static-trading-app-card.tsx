import React from 'react';
import { Text, Button } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config } from 'Constants/platform-config';
import './static-trading-app-card.scss';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const StaticTradingAppCard = ({
    name,
    icon,
    description,
    sub_title,
    has_applauncher_account,
    is_item_blurry,
}: AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const { app_desc } = platform_config.find(config => config.name === name) || {
        app_desc: description,
        link_to: '',
    };
    const icon_size = isMobile() ? 32 : 42;
    return (
        <div className='trading-app-card'>
            <TradigPlatformIconProps
                icon={icon}
                size={icon_size}
                className={is_item_blurry ? 'trading-app-card--blurry' : ''}
            />
            <div className='trading-app-card__details'>
                <Text
                    className='title'
                    color={is_item_blurry ? 'less-prominent' : 'prominent'}
                    size='xs'
                    line_height='s'
                >
                    {sub_title}
                </Text>
                <Text
                    className='title'
                    color={is_item_blurry ? 'less-prominent' : 'prominent'}
                    size='xs'
                    line_height='s'
                    weight='bold'
                >
                    {name}
                </Text>
                <Text
                    className='description'
                    color={is_item_blurry ? 'less-prominent' : 'prominent'}
                    size='xxs'
                    line_height='m'
                >
                    {app_desc}
                </Text>
            </div>
            {has_applauncher_account && (
                <div className='trading-app-card__actions'>
                    <Button primary>{localize(`Trade`)}</Button>
                </div>
            )}
        </div>
    );
};

export default StaticTradingAppCard;
