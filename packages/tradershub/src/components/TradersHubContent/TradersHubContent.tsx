import React, { Fragment } from 'react';
import useRegionFlags from '../../hooks/useRegionFlags';
import { CFDSection, OptionsAndMultipliersSection, useUIContext } from '..';

const TradersHubContent = () => {
    const { getUIState } = useUIContext();
    const activeRegion = getUIState('region');

    const { isEU } = useRegionFlags(activeRegion);

    if (isEU) {
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
