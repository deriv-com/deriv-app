import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CFDSection, OptionsAndMultipliersSection } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { POAFormContainer } from '@deriv-lib/account-v2-lib';

const TradersHubContent = () => {
    const { isEU } = useRegulationFlags();

    return (
        <div className={twMerge('flex gap-24 flex-col', isEU && 'flex-col-reverse')}>
            <POAFormContainer />
            <OptionsAndMultipliersSection />
            <CFDSection />
        </div>
    );
};

export default TradersHubContent;
