import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { useModal } from '../../../../components/ModalProvider';
import './TradingPlatformStatus.scss';

type TradingPlatformStatusModalProps = {
    isServerMaintenance: boolean;
};

const TradingPlatformStatus: React.FC<TradingPlatformStatusModalProps> = ({ isServerMaintenance }) => {
    const { hide } = useModal();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const title = isServerMaintenance ? localize('Server Maintenance') : localize('Account Unavailable');
    const content = isServerMaintenance
        ? localize('We’re currently performing server maintenance. Service may be affected.')
        : localize('The server is temporarily unavailable for this account. We’re working to resolve this.');

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
