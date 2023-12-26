import React, { Dispatch, FC, SetStateAction } from 'react';
import { Text } from '@deriv/quill-design';
import BackArrowIcon from '../../../../../public/images/ic-back-arrow.svg';
import DocumentsIcon from '../../../../../public/images/ic-documents.svg';
import IdCardIcon from '../../../../../public/images/ic-id-card.svg';
import NotApplicableIcon from '../../../../../public/images/ic-not-applicable.svg';
import SelfieIcon from '../../../../../public/images/ic-selfie.svg';
import VerificationFailedStatusIcon from '../../../../../public/images/ic-verification-failed-status.svg';
import VerificationPendingStatusIcon from '../../../../../public/images/ic-verification-pending-status.svg';
import VerificationSuccessStatusIcon from '../../../../../public/images/ic-verification-success-status.svg';
import { jurisdictionVerificationContents } from '../jurisdiction-contents/jurisdiction-verification-contents';
import {
    TJurisdictionCardItemVerification,
    TJurisdictionCardItemVerificationItem,
} from '../jurisdiction-contents/props.types';

const verificationIconsMapper: Record<string, JSX.Element> = {
    documentNumber: <IdCardIcon />,
    nameAndAddress: <DocumentsIcon />,
    notApplicable: <NotApplicableIcon />,
    selfie: <SelfieIcon />,
};

const verificationStatusIconsMapper: Record<string, JSX.Element> = {
    verificationFailedStatusIcon: <VerificationFailedStatusIcon />,
    verificationPendingStatusIcon: <VerificationPendingStatusIcon />,
    verificationSuccessStatusIcon: <VerificationSuccessStatusIcon />,
};

type TJurisdictionCardBackProps = {
    setIsFlipped: Dispatch<SetStateAction<boolean>>;
    verificationDocs?: TJurisdictionCardItemVerification;
};

const JurisdictionCardBack: FC<TJurisdictionCardBackProps> = ({ setIsFlipped, verificationDocs }) => {
    const verificationContents = jurisdictionVerificationContents();
    if (verificationDocs)
        return (
            <div className='absolute flex flex-col h-full transform backface-hidden rotate-y-180 gap-800 pt-[15px] px-800 pb-12000'>
                <BackArrowIcon
                    className='cursor-pointer'
                    onClick={e => {
                        e.stopPropagation();
                        setIsFlipped(false);
                    }}
                />
                <Text size='sm'>{verificationContents.shortDescription}</Text>
                {verificationDocs.map((verificationDocument: TJurisdictionCardItemVerificationItem, i) => {
                    return (
                        <div className='grid grid-flow-col gap-500' key={`${verificationDocument}-${i}`}>
                            {verificationIconsMapper[verificationDocument]}
                            <Text size='sm'>
                                {verificationContents.requiredVerificationDocs[verificationDocument]?.text}
                            </Text>
                        </div>
                    );
                })}
                <div className='border-t border-solid border-[2px] border-system-light-secondary-background' />
                {verificationContents.statusReferences.map((statusReference, i) => {
                    return (
                        <div className='grid grid-flow-col gap-500' key={`${statusReference}-${i}`}>
                            {verificationStatusIconsMapper[statusReference.icon]}
                            <Text size='sm'>{statusReference.text}</Text>
                        </div>
                    );
                })}
            </div>
        );
    return <></>;
};

export default JurisdictionCardBack;
