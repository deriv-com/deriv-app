import React from 'react';
import DocumentsIcon from '../../../../public/images/ic-documents.svg';
import IdCardIcon from '../../../../public/images/ic-id-card.svg';
import NotApplicableIcon from '../../../../public/images/ic-not-applicable.svg';
import SelfieIcon from '../../../../public/images/ic-selfie.svg';
import VerificationFailedStatusIcon from '../../../../public/images/ic-verification-failed-status.svg';
import VerificationPendingStatusIcon from '../../../../public/images/ic-verification-pending-status.svg';
import VerificationSuccessStatusIcon from '../../../../public/images/ic-verification-success-status.svg';

export const verificationIconsMapper: Record<string, JSX.Element> = {
    documentNumber: <IdCardIcon />,
    nameAndAddress: <DocumentsIcon />,
    notApplicable: <NotApplicableIcon />,
    selfie: <SelfieIcon />,
};

export const verificationStatusIconsMapper: Record<string, JSX.Element> = {
    verificationFailedStatusIcon: <VerificationFailedStatusIcon />,
    verificationPendingStatusIcon: <VerificationPendingStatusIcon />,
    verificationSuccessStatusIcon: <VerificationSuccessStatusIcon />,
};
