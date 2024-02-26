import React from 'react';
import { GetDerivAccount } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { OptionsAndMultipliersContent } from './OptionsAndMultipliersContent';
import { OptionsAndMultipliersHeading } from './OptionsAndMultipliersHeading';

/**
 * `OptionsAndMultipliersSection` is a component that renders the deriv platforms and currency switcher.
 * @returns {React.ElementType} The `OptionsAndMultipliersSection` component.
 */
const OptionsAndMultipliersSection = () => {
    const { isSuccess, noRealCRNonEUAccount, noRealMFEUAccount } = useRegulationFlags();
    return (
        <div className='overflow-y-scroll pt-16 lg:p-24 lg:rounded-[24px] lg:outline-1 lg:outline lg:outline-system-light-hover-background'>
            <div className='flex-col justify-between w-full gap-24'>
                <OptionsAndMultipliersHeading />
                {(noRealCRNonEUAccount || noRealMFEUAccount) && isSuccess && <GetDerivAccount />}
                <OptionsAndMultipliersContent />
            </div>
        </div>
    );
};
export default OptionsAndMultipliersSection;
