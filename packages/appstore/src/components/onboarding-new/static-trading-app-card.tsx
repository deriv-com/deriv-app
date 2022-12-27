import React from 'react';
import { Text, Button } from '@deriv/components';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';
import { platform_config } from 'Constants/platform-config';
import './static-trading-app-card.scss';
import { AvailableAccount, TDetailsOfEachMT5Loginid } from 'Types';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import classNames from 'classnames';

const StaticTradingAppCard = ({
    name,
    icon,
    description,
    has_divider,
    sub_title,
    has_applauncher_account,
    is_item_blurry,
}: AvailableAccount & TDetailsOfEachMT5Loginid & { has_divider?: boolean }) => {
    const { app_desc } = platform_config.find(config => config.name === name) || {
        app_desc: description,
        link_to: '',
    };
    const icon_size = isMobile() ? 72 : 48;
    return (
        <div className='trading-app-card'>
            <TradigPlatformIconProps
                icon={icon}
                size={has_applauncher_account ? 72 : icon_size}
                className={is_item_blurry ? 'trading-app-card--blurry' : ''}
            />
            <div
                className={classNames('trading-app-card__details', {
                    'trading-app-card--divider': has_divider && !isMobile(),
                })}
            >
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
            <div className={classNames('trading-app-card__actions')}>
                <Button primary className={has_applauncher_account ? '' : 'trading-app-card__button--hidden'}>
                    {localize(`Trade`)}
                </Button>
            </div>
        </div>
    );
};

export default StaticTradingAppCard;
