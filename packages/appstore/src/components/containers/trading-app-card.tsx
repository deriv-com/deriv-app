import React from 'react';
import { Text } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config, BrandConfig } from 'Constants/platform-config';
import './trading-app-card.scss';
import TradingAppCardActions, { Actions } from './trading-app-card-actions';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { isMobile } from '@deriv/shared';

const TradingAppCard = ({
    name,
    icon,
    type,
    description,
    is_disabled,
    onAction,
    sub_title,
}: Actions & BrandConfig & AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const { app_desc, link_to } = platform_config.find(config => config.name === name) || {
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
                <TradingAppCardActions type={type} link_to={link_to} is_disabled={is_disabled} onAction={onAction} />
            </div>
        </div>
    );
};

export default TradingAppCard;
