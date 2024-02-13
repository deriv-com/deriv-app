import React, { Fragment } from 'react';
import { CFDSection, OptionsAndMultipliersSection } from '@/components';
import { useRegulationFlags } from '@/hooks';

const TradersHubContent = () => {
    const { isEU } = useRegulationFlags();

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
