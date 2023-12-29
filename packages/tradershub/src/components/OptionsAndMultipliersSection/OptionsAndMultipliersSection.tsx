import React from 'react';
import { OptionsAndMultipliersHeading } from './OptionsAndMultiplersHeading';
import { OptionsAndMultipliersContent } from './OptionsAndMultipliersContent';

/**
 * `OptionsAndMultipliersSection` is a component that renders the deriv platforms and currency switcher.
 * @returns {React.ElementType} The `OptionsAndMultipliersSection` component.
 */
const OptionsAndMultipliersSection = () => {
    return (
        <div className='border-solid p-1200 rounded-1200 border-xs border-opacity-black-100 '>
            <div className='flex-col w-full gap-1200 '>
                <OptionsAndMultipliersHeading />
                <OptionsAndMultipliersContent />
            </div>
        </div>
    );
};
export default OptionsAndMultipliersSection;
