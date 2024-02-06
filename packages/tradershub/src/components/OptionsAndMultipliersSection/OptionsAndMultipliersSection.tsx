import React from 'react';
import useRegulationFlags from '../../hooks/useRegulationFlags';
import { GetDerivAccount } from '../GetDerivAccount';
import { useUIContext } from '../UIProvider';
import { OptionsAndMultipliersContent } from './OptionsAndMultipliersContent';
import { OptionsAndMultipliersHeading } from './OptionsAndMultipliersHeading';

/**
 * `OptionsAndMultipliersSection` is a component that renders the deriv platforms and currency switcher.
 * @returns {React.ElementType} The `OptionsAndMultipliersSection` component.
 */
const OptionsAndMultipliersSection = () => {
    const { uiState } = useUIContext();
    const { accountType, regulation } = uiState;
    const { isSuccess, noRealCRNonEUAccount, noRealMFEUAccount } = useRegulationFlags(regulation, accountType);
    return (
        <div className='overflow-y-scroll pt-800 lg:border-solid lg:p-1200 lg:rounded-1200 lg:border-xs lg:border-opacity-black-100 '>
            <div className='flex-col justify-between w-full gap-1200 '>
                <OptionsAndMultipliersHeading />
                {(noRealCRNonEUAccount || noRealMFEUAccount) && isSuccess && <GetDerivAccount />}
                <OptionsAndMultipliersContent />
            </div>
        </div>
    );
};
export default OptionsAndMultipliersSection;
