import React from 'react';
import { Modal } from '@/components';
import { CFDPlatforms, PlatformDetails } from '@cfd/constants';
import { Provider } from '@deriv/library';
import MT5ChangePasswordScreens from './MT5ChangePasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

const ChangePassword = () => {
    const { getCFDState } = Provider.useCFDContext();
    const platform = getCFDState('platform') ?? CFDPlatforms.MT5;
    const { title } = PlatformDetails[platform];

    const isDerivX = platform === CFDPlatforms.DXTRADE;

    return (
        <Modal>
            <Modal.Header title={`Manage ${title} password`} />
            <Modal.Content>
                <div className='flex flex-col w-[94px] md:w-auto md:p-16 h-[688px]'>
                    <div className='flex flex-col content-center mx-auto pt-24 w-[452px] h-full md:w-full'>
                        {isDerivX ? (
                            <TradingPlatformChangePasswordScreens platform={platform} />
                        ) : (
                            <MT5ChangePasswordScreens />
                        )}
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    );
};

export default ChangePassword;
