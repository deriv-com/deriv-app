import React from 'react';
import { Onfido } from '../../screens';
import { ModalStepWrapper, WalletButton } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';

const OnfidoModal = () => {
    const { isMobile } = useDevice();
    return (
        <ModalStepWrapper
            renderFooter={() => (
                <WalletButton disabled isFullWidth={isMobile} onClick={() => undefined} size='lg' text='Next' />
            )}
            title='Add a real MT5 account'
        >
            <Onfido />
        </ModalStepWrapper>
    );
};

export default OnfidoModal;
