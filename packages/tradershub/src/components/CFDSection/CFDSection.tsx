import React from 'react';
import { useRegulationFlags } from '@/hooks';
import { GetADerivAccountBanner } from '../GetADerivAccountBanner';
import { CFDContent } from './CFDContent';
import { CFDHeading } from './CFDHeading';

const CFDSection = () => {
    const { isSuccess, noRealCRNonEUAccount, noRealMFEUAccount } = useRegulationFlags();

    return (
        <div className='overflow-y-scroll border-solid pt-800 lg:p-1200 rounded-1200 lg:border-xs lg:border-opacity-black-100'>
            <CFDHeading />
            {(noRealCRNonEUAccount || noRealMFEUAccount) && isSuccess && (
                <div className='pt-1000'>
                    <GetADerivAccountBanner />
                </div>
            )}
            <CFDContent />
        </div>
    );
};

export default CFDSection;
