import React from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import './TradingPlatformStatus.scss';

type TradingPlatformStatusModalProps = {
    isServerMaintenance: boolean;
};

const TradingPlatformStatus: React.FC<TradingPlatformStatusModalProps> = ({ isServerMaintenance }) => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    const title = isServerMaintenance ? 'Server Maintenance' : 'Account Unavailable';
    const content = isServerMaintenance
        ? 'We’re currently performing server maintenance. Service maybe affected.'
        : 'The server is temporarily unavailable for this account. We’re working to resolve this.';

    return (
        <div className='wallets-server-maintenance'>
            <WalletText size='md' weight='bold'>
                {title}
            </WalletText>
            <div className='wallets-server-maintenance__content'>
                <WalletText size='sm'>{content}</WalletText>
            </div>
            <div className='wallets-server-maintenance__footer'>
                <WalletButton onClick={() => hide()} size={isMobile ? 'md' : 'lg'} variant='outlined'>
                    OK
                </WalletButton>
            </div>
        </div>
    );
};

export default TradingPlatformStatus;
