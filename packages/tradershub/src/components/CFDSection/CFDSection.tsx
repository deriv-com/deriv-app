import React from 'react';
import { useRegulationFlags } from '@/hooks';
import { GetADerivAccountBanner } from '../GetADerivAccountBanner';
import { CFDContent } from './CFDContent';
import { CFDHeading } from './CFDHeading';

const CFDSection = () => {
    const { isSuccess, noRealCRNonEUAccount, noRealMFEUAccount } = useRegulationFlags();

    return (
        <div className='overflow-y-scroll pt-16 lg:p-24 rounded-[24px] lg:outline-1 lg:outline lg:outline-system-light-hover-background'>
            <CFDHeading />
            {(noRealCRNonEUAccount || noRealMFEUAccount) && isSuccess && (
                <div className='pt-20'>
                    <GetADerivAccountBanner />
                </div>
            )}
            <CFDContent />
        </div>
    );
};

export default CFDSection;
