import React from 'react';
import useRegulationFlags from '../../hooks/useRegulationFlags';
import { GetADerivAccountBanner } from '../GetADerivAccountBanner';
import { useUIContext } from '../UIProvider';
import { CFDContent } from './CFDContent';
import { CFDHeading } from './CFDHeading';

const CFDSection = () => {
    const { getUIState } = useUIContext();
    const regulation = getUIState('regulation');
    const accountType = getUIState('accountType');
    const { noRealCRNonEUAccount, noRealMFEUAccount } = useRegulationFlags(regulation, accountType);

    return (
        <div className='overflow-y-scroll border-solid pt-800 lg:p-1200 rounded-1200 lg:border-xs lg:border-opacity-black-100'>
            <CFDHeading />
            {(noRealCRNonEUAccount || noRealMFEUAccount) && (
                <div className='pt-1000'>
                    <GetADerivAccountBanner />
                </div>
            )}
            <CFDContent />
        </div>
    );
};

export default CFDSection;
