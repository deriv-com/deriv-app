import React from 'react';
import DocumentsIcon from '@/assets/svgs/ic-documents.svg';
import IdCardIcon from '@/assets/svgs/ic-id-card.svg';
import NotApplicableIcon from '@/assets/svgs/ic-not-applicable.svg';
import SelfieIcon from '@/assets/svgs/ic-selfie.svg';
import VerificationFailedStatusIcon from '@/assets/svgs/ic-verification-failed-status.svg';
import VerificationPendingStatusIcon from '@/assets/svgs/ic-verification-pending-status.svg';
import VerificationSuccessStatusIcon from '@/assets/svgs/ic-verification-success-status.svg';

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
