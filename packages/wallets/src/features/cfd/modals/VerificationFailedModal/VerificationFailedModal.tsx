import React, { FC } from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { VerificationFailed } from '../../screens';

const VerificationFailedModal: FC = () => {
    return (
        <ModalWrapper hideCloseButton>
            <VerificationFailed />
        </ModalWrapper>
    );
};

export default VerificationFailedModal;
