import React, { Dispatch, SetStateAction } from 'react';
import { Text } from '@deriv/quill-design';
import BackArrowIcon from '../../../../../public/images/ic-back-arrow.svg';
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
        <div className='absolute flex flex-col h-full transform backface-hidden [transform:rotateY(180deg)] gap-800 pt-[15px] px-800 pb-12000'>
            <BackArrowIcon
                className='cursor-pointer'
                onClick={e => {
                    e.stopPropagation();
                    setIsFlipped(false);
                }}
            />
            <Text size='sm'>{verificationContents.shortDescription}</Text>
            {verificationDocs.map((verificationDocument: TJurisdictionCardItemVerificationItem) => {
                return (
                    <div className='grid justify-start grid-flow-col gap-500' key={verificationDocument}>
                        <div className='mt-200'>{verificationIconsMapper[verificationDocument]}</div>
                        <Text size='sm'>
                            {verificationContents.requiredVerificationDocs[verificationDocument]?.text}
                        </Text>
                    </div>
                );
            })}
            <div className='border-t border-solid border-75 my-800 border-system-light-secondary-background' />
            {verificationContents.statusReferences.map(statusReference => {
                return (
                    <div className='grid justify-start grid-flow-col gap-500' key={statusReference?.color}>
                        <div className='mt-200'>{verificationStatusIconsMapper[statusReference.icon]}</div>
                        <Text size='sm'>{statusReference.text}</Text>
                    </div>
                );
            })}
        </div>
    );
};

export default JurisdictionCardBack;
