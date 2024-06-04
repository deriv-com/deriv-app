import React from 'react';
import { useQueryParams } from '@/hooks';
import { useCFDContext } from '@/providers';
import { CFDPlatforms, PlatformDetails } from '@cfd/constants';
import { Modal } from '@deriv-com/ui';
import MT5ChangePasswordScreens from './MT5ChangePasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

const ChangePassword = () => {
    const { cfdState } = useCFDContext();
    const { isModalOpen, closeModal } = useQueryParams();
    const { platform: platformState } = cfdState;
    const platform = platformState ?? CFDPlatforms.MT5;
    const { title } = PlatformDetails[platform];

    const isDerivX = platform === CFDPlatforms.DXTRADE;

    return (
        <Modal isOpen={isModalOpen('ChangePassword')} onRequestClose={closeModal}>
            <Modal.Header onRequestClose={closeModal} title={`Manage ${title} password`} />
            <Modal.Body>
                <div className='flex flex-col w-[94px] md:w-auto md:p-16 h-[688px]'>
                    <div className='flex flex-col content-center mx-auto pt-24 w-[452px] h-full md:w-full'>
                        {isDerivX ? (
                            <TradingPlatformChangePasswordScreens platform={platform} />
                        ) : (
                            <MT5ChangePasswordScreens />
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePassword;
