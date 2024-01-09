import React from 'react';
import { OptionsAndMultipliersHeading } from './OptionsAndMultiplersHeading';
import { OptionsAndMultipliersContent } from './OptionsAndMultipliersContent';

/**
 * `OptionsAndMultipliersSection` is a component that renders the deriv platforms and currency switcher.
 * @returns {React.ElementType} The `OptionsAndMultipliersSection` component.
 */
const OptionsAndMultipliersSection = () => {
    return (
        <div className='pt-800 overflow-y-scroll sm:border-solid sm:p-1200 sm:rounded-1200 sm:border-xs sm:border-opacity-black-100 '>
            <div className='flex-col w-full gap-1200 '>
                <OptionsAndMultipliersHeading />
                <OptionsAndMultipliersContent />
            </div>
        </div>
    );
};
export default OptionsAndMultipliersSection;
