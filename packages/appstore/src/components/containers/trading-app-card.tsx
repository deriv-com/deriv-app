import React from 'react';
import { Button, Text } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config, BrandConfig } from 'Constants/platform-config';
import './trading-app-card.scss';
import { Link } from 'react-router-dom';

const TradingAppCard = ({ name, icon }: BrandConfig) => {
    const { app_desc, link_to } = platform_config.find(p => p.name === name) || platform_config[0];
    return (
        <div className='trading-app-card'>
            <TradigPlatformIconProps icon={icon} size={48} />
            <div className='trading-app-card__details'>
                <Text className='title' size='xs' line_height='s' weight='bold'>
                    {icon}
                </Text>
                <Text className='description' size='xxs' line_height='m'>
                    {app_desc}
                </Text>
            </div>
            <div className='trading-app-card__actions'>
                <Link to={link_to}>
                    <Button primary>Trade</Button>
                </Link>
            </div>
        </div>
    );
};

export default TradingAppCard;
