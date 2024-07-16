import React from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { CFD_PLATFORMS } from '../../constants';
import './ServerMaintenance.scss';

const ServerMaintenance: React.FC = () => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    const getMaintenanceTime = (platform: string) => {
        switch (platform) {
            case CFD_PLATFORMS.DXTRADE:
                return '08:00 GMT';
            case CFD_PLATFORMS.CTRADER:
                return '10:00 GMT';
            case CFD_PLATFORMS.MT5:
            default:
                return '03:00 GMT';
        }
    };
    return (
        <div className='wallets-server-maintenance'>
            <WalletText size='md' weight='bold'>
                Server Maintenance
            </WalletText>
            <div className='wallets-server-maintenance__content'>
                <WalletText size='sm'>
                    {`We’re currently performing server maintenance, which may continue until ${getMaintenanceTime(
                        'mt5'
                    )}. Please expect some disruptions during this time.`}
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
