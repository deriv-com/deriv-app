import React, { FC } from 'react';
import { WalletButton, WalletText } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { TPlatforms } from '../../../../types';
import { CFD_PLATFORMS } from '../../constants';
import './ServerMaintenance.scss';

type TServerMaintenanceProps = {
    platform: TPlatforms.All;
};

const ServerMaintenance: FC<TServerMaintenanceProps> = ({ platform }) => {
    const { hide } = useModal();
    const { isMobile } = useDevice();

    const maintenanceTime: {
        [key: string]: string;
    } = {
        [CFD_PLATFORMS.DXTRADE]: '08:00 GMT',
        [CFD_PLATFORMS.CTRADER]: '10:00 GMT',
        [CFD_PLATFORMS.MT5]: '03:00 GMT',
    };

    const platformKey: keyof typeof maintenanceTime = platform;

    return (
        <div className='wallets-server-maintenance'>
            <WalletText size='md' weight='bold'>
                Server Maintenance
            </WalletText>
            <div>
                <WalletText size='sm'>
                    We’re currently performing server maintenance, which may continue until{' '}
                </WalletText>
                <WalletText size='sm' weight='bold'>
                    {maintenanceTime[platformKey]}
                </WalletText>
                <WalletText size='sm'>. Please expect some disruptions during this time.</WalletText>
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
