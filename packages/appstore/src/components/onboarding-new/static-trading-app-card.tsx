import React from 'react';
import { Text, Button } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config } from 'Constants/platform-config';
import './static-trading-app-card.scss';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const StaticTradingAppCard = ({ name, icon, description, sub_title }: AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const { app_desc } = platform_config.find(config => config.name === name) || {
        app_desc: description,
        link_to: '',
    };
    const icon_size = isMobile() ? 48 : 64;
    return (
        <div className='trading-app-card'>
            <TradigPlatformIconProps icon={icon} size={icon_size} />
            <div className='trading-app-card__details'>
                <Text className='title' size='xs' line_height='s'>
                    {sub_title}
                </Text>
                <Text className='title' size='xs' line_height='s' weight='bold'>
                    {name}
                </Text>
                <Text className='description' size='xxs' line_height='m'>
                    {app_desc}
                </Text>
            </div>
            <div className='trading-app-card__actions'>
                <Button primary>{localize(`Trade`)}</Button>
            </div>
        </div>
    );
};

export default StaticTradingAppCard;
