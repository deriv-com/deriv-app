import React, { Dispatch, SetStateAction } from 'react';
import { LabelPairedArrowLeftLgRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import { verificationIconsMapper, verificationStatusIconsMapper } from '../constants';
import { jurisdictionVerificationContents } from '../jurisdiction-contents/jurisdiction-verification-contents';
import {
    TJurisdictionCardItemVerification,
    TJurisdictionCardItemVerificationItem,
} from '../jurisdiction-contents/props.types';

type TJurisdictionCardBackProps = {
    setIsFlipped: Dispatch<SetStateAction<boolean>>;
    verificationDocs?: TJurisdictionCardItemVerification;
};

const JurisdictionCardBack = ({ setIsFlipped, verificationDocs }: TJurisdictionCardBackProps) => {
    const verificationContents = jurisdictionVerificationContents();
    if (!verificationDocs) return null;
    return (
        <div className='absolute flex flex-col h-full backface-hidden [transform:rotateY(180deg)] gap-16 pt-[15px] px-16'>
            <div>
                <LabelPairedArrowLeftLgRegularIcon
                    className='cursor-pointer'
                    onClick={e => {
                        e.stopPropagation();
                        setIsFlipped(false);
                    }}
                />
            </div>
            <Text size='sm'>{verificationContents.shortDescription}</Text>
            {verificationDocs.map((verificationDocument: TJurisdictionCardItemVerificationItem) => {
                return (
                    <div className='grid justify-start grid-flow-col gap-10' key={verificationDocument}>
                        <div className='mt-4'>{verificationIconsMapper[verificationDocument]}</div>
                        <Text size='sm'>
                            {verificationContents.requiredVerificationDocs[verificationDocument]?.text}
                        </Text>
                    </div>
                );
            })}
            <div className='my-16 border-t border-solid border-1 border-system-light-secondary-background' />
            {verificationContents.statusReferences.map(statusReference => {
                return (
                    <div className='grid justify-start grid-flow-col gap-10' key={statusReference?.color}>
                        <div className='mt-4'>{verificationStatusIconsMapper[statusReference.icon]}</div>
                        <Text size='sm'>{statusReference.text}</Text>
                    </div>
                );
            })}
        </div>
    );
};

export default JurisdictionCardBack;
