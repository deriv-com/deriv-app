import React, { FC } from 'react';
import { THooks } from '../../../../types';
import { ModalWrapper } from '../../../../components/Base';
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
