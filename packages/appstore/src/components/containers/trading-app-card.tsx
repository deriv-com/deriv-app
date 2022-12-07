import React from 'react';
import { Button, Text } from '@deriv/components';
import WalletIcon from 'Assets/svgs/wallet';
import { PlatformConfig } from 'Constants/platform-config';
import './trading-app-card.scss';

const TradingAppCard = ({ app_icon, app_title, app_desc }: Omit<PlatformConfig, 'availiblity'>) => {
    return (
        <div className='trading-app-card'>
            <WalletIcon icon={app_icon} size={48} />
            <div className='trading-app-card__details'>
                <Text className='title' size='xs' line_height='s' weight='bold'>
                    {app_title}
                </Text>
                <Text className='description' size='xxs' line_height='m'>
                    {app_desc}
                </Text>
            </div>
            <div className='trading-app-card__actions'>
                <Button>Get</Button>
            </div>
        </div>
    );
};

export default TradingAppCard;
