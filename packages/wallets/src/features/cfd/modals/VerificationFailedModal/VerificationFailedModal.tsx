import React, { FC } from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { VerificationFailed } from '../../screens';

const VerificationFailedModal: FC<unknown> = () => {
    return (
        <ModalWrapper hideCloseButton>
            <VerificationFailed />
        </ModalWrapper>
    );
};

export default VerificationFailedModal;
