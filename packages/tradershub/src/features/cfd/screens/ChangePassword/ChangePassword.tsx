import React from 'react';
import { Modal } from '../../../../components/Modal';
import { Provider } from '@deriv/library';
import { PlatformDetails } from '../../constants';
import MT5ChangePasswordScreens from './MT5ChangePasswordScreens';
import TradingPlatformChangePasswordScreens from './TradingPlatformChangePasswordScreens';

const ChangePassword = () => {
    const { getCFDState } = Provider.useCFDContext();
    const platform = getCFDState('platform') ?? PlatformDetails.mt5.platform;
    const { title } = PlatformDetails[platform];

    const isDerivX = platform === PlatformDetails.dxtrade.platform;

    return (
        <Modal>
            <Modal.Header title={`Manage ${title} password`} />
            <Modal.Content>
                <div className='flex flex-col w-[9.4rem] lg:w-auto lg:p-800 h-[6.88]'>
                    <div className='flex flex-col content-center my-50 mx-auto pt-1200 w-[4.52rem] h-[100%] lg:w-[100%]'>
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
