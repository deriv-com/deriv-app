import React, { Fragment } from 'react';
import { useIsEuRegion } from '@deriv/api';
import { CFDSection, OptionsAndMultipliersSection, useUIContext } from '..';

const TradersHubContent = () => {
    const { isEUCountry } = useIsEuRegion();

    const { getUIState } = useUIContext();
    const activeRegion = getUIState('region');

    const euRegion = activeRegion === 'EU' || isEUCountry;

    if (euRegion) {
        return (
            <Fragment>
                <CFDSection />
                <OptionsAndMultipliersSection />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <OptionsAndMultipliersSection />
            <CFDSection />
        </Fragment>
    );
};

export default TradersHubContent;
