import React, { FC } from 'react';
import { ModalWrapper } from '../../../../components/Base';
import { THooks } from '../../../../types';
import { VerificationFailed } from '../../screens';

type TVerificationFailedModalProps = {
    selectedJurisdiction: THooks.MT5AccountsList['landing_company_short'];
};

const VerificationFailedModal: FC<TVerificationFailedModalProps> = ({ selectedJurisdiction }) => {
    return (
        <ModalWrapper hideCloseButton>
            <VerificationFailed selectedJurisdiction={selectedJurisdiction} />
        </ModalWrapper>
    );
};

export default VerificationFailedModal;
