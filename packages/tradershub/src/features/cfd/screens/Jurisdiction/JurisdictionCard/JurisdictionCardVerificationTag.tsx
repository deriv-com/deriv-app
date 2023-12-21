import React, { ReactNode } from 'react';
import { useAuthentication } from '@deriv/api';
import VerificationFailedIcon from '../../../../../public/images/ic-verification-failed-status.svg';
import VerificationPendingIcon from '../../../../../public/images/ic-verification-pending-status.svg';
import VerificationSuccessIcon from '../../../../../public/images/ic-verification-success-status.svg';
import { THooks } from '../../../../../types';

type Props = {
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

const JurisdictionCardVerificationTag: React.FC<Props> = ({ category, icon }) => {
    const { data } = useAuthentication();

    return (
        <div className='relative '>
            {icon}
            {category === 'poi' &&
                data?.poi_status &&
                Object.keys(verificationStatusIconMapper).includes(data.poi_status) && (
                    <div className='absolute -top-[20%] -right-[20%]'>
                        {verificationStatusIconMapper[data.poi_status]}
                    </div>
                )}
            {category === 'poa' &&
                data?.poa_status &&
                Object.keys(verificationStatusIconMapper).includes(data.poa_status) && (
                    <div className='absolute -top-[-20%] -right-[20%]'>
                        {verificationStatusIconMapper[data.poa_status]}
                    </div>
                )}
        </div>
    );
};

export default JurisdictionCardVerificationTag;
