import React, { FC } from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { VerificationFailed } from '../../screens';

type TVerificationFailedModalProps = {
    verificationType: 'all' | 'poa' | 'poi';
};

const VerificationFailedModal: FC<TVerificationFailedModalProps> = ({ verificationType }) => {
    return (
        <ModalWrapper hideCloseButton>
            <VerificationFailed />
        </ModalWrapper>
    );
};

export default VerificationFailedModal;
