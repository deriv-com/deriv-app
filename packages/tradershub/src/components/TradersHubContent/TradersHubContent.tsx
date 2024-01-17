import React, { Fragment } from 'react';
import useRegulationFlags from '../../hooks/useRegulationFlags';
import { CFDSection, OptionsAndMultipliersSection, useUIContext } from '..';

const TradersHubContent = () => {
    const { getUIState } = useUIContext();
    const activeRegulation = getUIState('regulation');

    const { isEU } = useRegulationFlags(activeRegulation);

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
