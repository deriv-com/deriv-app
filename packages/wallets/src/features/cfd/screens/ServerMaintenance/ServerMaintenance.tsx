import React from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import './ServerMaintenance.scss';

const ServerMaintenance = () => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    return (
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
    );
};

export default ServerMaintenance;
