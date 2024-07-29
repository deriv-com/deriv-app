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

    return isServerMaintenance ? (
        <div className='wallets-server-maintenance'>
            <WalletText size='md' weight='bold'>
                Server Maintenance
            </WalletText>
            <div>
                <WalletText size='sm'>
                    We’re currently performing server maintenance. Service maybe affected.
                </WalletText>
            </div>
            <div className='wallets-server-maintenance__footer'>
                <WalletButton onClick={() => hide()} size={isMobile ? 'md' : 'lg'} variant='outlined'>
                    OK
                </WalletButton>
            </div>
        </div>
    ) : (
        <div className='wallets-account-unavailable'>
            <WalletText size='md' weight='bold'>
                Account Unavailable
            </WalletText>
            <div className='wallets-account-unavailable__content'>
                <WalletText size='sm'>
                    The server is temporarily unavailable for this account. We’re working to resolve this.
                </WalletText>
            </div>
            <div className='wallets-account-unavailable__footer'>
                <WalletButton onClick={() => hide()} size={isMobile ? 'md' : 'lg'} variant='outlined'>
                    OK
                </WalletButton>
            </div>
        </div>
    );
};

export default TradingPlatformStatus;
