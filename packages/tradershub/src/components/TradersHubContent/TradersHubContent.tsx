import React, { Fragment } from 'react';
import { CFDSection, OptionsAndMultipliersSection, useUIContext } from '@/components';
import { useRegulationFlags } from '@/hooks';

const TradersHubContent = () => {
    const { uiState } = useUIContext();
    const activeRegulation = uiState.regulation;

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
