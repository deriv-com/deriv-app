import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CFDSection, OptionsAndMultipliersSection } from '@/components';
import { useRegulationFlags } from '@/hooks';

const TradersHubContent = () => {
    const { isEU } = useRegulationFlags();

    return (
        <div className={twMerge('flex gap-24 flex-col', isEU && 'flex-col-reverse')}>
            <OptionsAndMultipliersSection />
            <CFDSection />
        </div>
    );
};

export default TradersHubContent;
