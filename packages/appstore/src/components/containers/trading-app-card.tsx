import React from 'react';
import { Text } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config, mf_platform_config, BrandConfig } from 'Constants/platform-config';
import './trading-app-card.scss';
import TradingAppCardActions, { Actions } from './trading-app-card-actions';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { isMobile } from '@deriv/shared';
import { useStores } from 'Stores/index';
import { observer } from 'mobx-react-lite';

const TradingAppCard = ({
    name,
    icon,
    type,
    description,
    is_disabled,
    is_deriv_platform = false,
    onAction,
    sub_title,
}: Actions & BrandConfig & AvailableAccount & TDetailsOfEachMT5Loginid) => {
    const { client } = useStores();

    const platform = client.is_eu ? mf_platform_config : platform_config;

    const { app_desc, link_to } = platform.find(config => config.name === name) || {
        app_desc: description,
        link_to: '',
    };
    return (
        <div className='trading-app-card'>
            <div>
                <TradigPlatformIconProps icon={icon} size={48} />
            </div>
            <div className='trading-app-card__details'>
                <Text className='title' size='xs' line_height='s'>
                    {sub_title}
                </Text>
                <Text className='title' size='xs' line_height='s' weight='bold'>
                    {name}
                </Text>
                <Text
                    className='description'
                    color={is_deriv_platform ? 'less-prominent' : ''}
                    size='xxs'
                    line_height='m'
                >
                    {app_desc}
                </Text>
            </div>
            <div className='trading-app-card__actions'>
                <TradingAppCardActions type={type} link_to={link_to} is_disabled={is_disabled} onAction={onAction} />
            </div>
        </div>
    );
};

export default observer(TradingAppCard);
