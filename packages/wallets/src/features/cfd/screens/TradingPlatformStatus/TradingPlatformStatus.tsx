import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { useModal } from '../../../../components/ModalProvider';
import { DISABLED_PLATFORM_STATUSES, MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../constants';
import './TradingPlatformStatus.scss';

type TradingPlatformStatusModalProps = {
    status: (typeof DISABLED_PLATFORM_STATUSES)[number];
};

const getContentConfig = (localize: ReturnType<typeof useTranslations>['localize']) => {
    const maintenanceConfig = {
        content: localize('We’re currently performing server maintenance. Service may be affected.'),
        title: localize('Server Maintenance'),
    };
    const unavailableConfig = {
        content: localize('The server is temporarily unavailable for this account. We’re working to resolve this.'),
        title: localize('Account Unavailable'),
    };

    return {
        [MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE]: maintenanceConfig,
        [TRADING_PLATFORM_STATUS.MAINTENANCE]: maintenanceConfig,
        [MT5_ACCOUNT_STATUS.UNAVAILABLE]: unavailableConfig,
        [TRADING_PLATFORM_STATUS.UNAVAILABLE]: unavailableConfig,
    };
};

const TradingPlatformStatus: React.FC<TradingPlatformStatusModalProps> = ({ status }) => {
    const { hide } = useModal();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const { content, title } = getContentConfig(localize)[status];

    return (
        <div className='wallets-server-maintenance'>
            <Text size='md' weight='bold'>
                {title}
            </Text>
            <div className='wallets-server-maintenance__content'>
                <Text size='sm'>{content}</Text>
            </div>
            <div className='wallets-server-maintenance__footer'>
                <Button
                    borderWidth='sm'
                    color='black'
                    onClick={() => hide()}
                    size={isDesktop ? 'md' : 'lg'}
                    textSize='sm'
                    variant='outlined'
                >
                    {localize('OK')}
                </Button>
            </div>
        </div>
    );
};

export default TradingPlatformStatus;
