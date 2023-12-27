import React, { Dispatch, FC, SetStateAction } from 'react';
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

const JurisdictionCardBack: FC<TJurisdictionCardBackProps> = ({ setIsFlipped, verificationDocs }) => {
    const verificationContents = jurisdictionVerificationContents();
    if (!verificationDocs) return <></>;
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
            {verificationDocs.map((verificationDocument: TJurisdictionCardItemVerificationItem) => {
                return (
                    <div className='grid grid-flow-col gap-500' key={verificationDocument}>
                        {verificationIconsMapper[verificationDocument]}
                        <Text size='sm'>
                            {verificationContents.requiredVerificationDocs[verificationDocument]?.text}
                        </Text>
                    </div>
                );
            })}
            <div className='border-t border-solid border-[2px] border-system-light-secondary-background' />
            {verificationContents.statusReferences.map(statusReference => {
                return (
                    <div className='grid grid-flow-col gap-500' key={statusReference?.color}>
                        {verificationStatusIconsMapper[statusReference.icon]}
                        <Text size='sm'>{statusReference.text}</Text>
                    </div>
                );
            })}
        </div>
    );
};

export default JurisdictionCardBack;
