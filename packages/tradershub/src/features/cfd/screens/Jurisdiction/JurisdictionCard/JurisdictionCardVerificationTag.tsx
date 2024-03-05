import React, { ReactNode } from 'react';
import VerificationFailedIcon from '@/assets/svgs/ic-verification-failed-status.svg';
import VerificationPendingIcon from '@/assets/svgs/ic-verification-pending-status.svg';
import VerificationSuccessIcon from '@/assets/svgs/ic-verification-success-status.svg';
import { THooks } from '@/types';
import { useAuthentication } from '@deriv/api-v2';

type TJurisdictionCardVerificationTagProps = {
    category: 'poa' | 'poi' | null;
    icon: ReactNode;
};

const verificationStatusIconMapper: Partial<
    Record<
        NonNullable<THooks.Authentication['poa_status']> | NonNullable<THooks.Authentication['poi_status']>,
        JSX.Element
    >
> = {
    pending: <VerificationPendingIcon height={8} width={8} />,
    rejected: <VerificationFailedIcon height={8} width={8} />,
    verified: <VerificationSuccessIcon height={8} width={8} />,
};

/**
 * Component to show the verification status of the user
 * @param category
 * @param icon
 * @returns
 */

const JurisdictionCardVerificationTag = ({ category, icon }: TJurisdictionCardVerificationTagProps) => {
    const { data } = useAuthentication();

    const renderStatusIcon = (
        category: TJurisdictionCardVerificationTagProps['category'],
        status: NonNullable<THooks.Authentication['poa_status' | 'poi_status']>
    ) => {
        if (category && status && Object.keys(verificationStatusIconMapper).includes(status)) {
            return (
                <div className='absolute -top-[20%] -right-[20%]'>
                    {verificationStatusIconMapper[status as keyof typeof verificationStatusIconMapper]}
                </div>
            );
        }
        return null;
    };

    return (
        <div className='relative '>
            {icon}
            {category === 'poi' && renderStatusIcon(category, data?.poi_status || 'none')}
            {category === 'poa' && renderStatusIcon(category, data?.poa_status || 'none')}
        </div>
    );
};

export default JurisdictionCardVerificationTag;
