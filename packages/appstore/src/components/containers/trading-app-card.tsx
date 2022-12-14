import React from 'react';
import { Text } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config, BrandConfig } from 'Constants/platform-config';
import './trading-app-card.scss';
import TradingAppCardActions, { Actions } from './trading-app-card-actions';

const TradingAppCard = ({ name, icon, type }: Actions & BrandConfig) => {
    const { app_desc, link_to } = platform_config.find(config => config.name === name) || platform_config[0];
    return (
        <div className='trading-app-card'>
            <TradigPlatformIconProps icon={icon} size={48} />
            <div className='trading-app-card__details'>
                <Text className='title' size='xs' line_height='s' weight='bold'>
                    {name}
                </Text>
                <Text className='description' size='xxs' line_height='m'>
                    {app_desc}
                </Text>
            </div>
            <div className='trading-app-card__actions'>
                <TradingAppCardActions type={type} link_to={link_to} />
            </div>
        </div>
    );
};

export default TradingAppCard;
