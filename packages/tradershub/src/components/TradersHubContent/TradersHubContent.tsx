import React, { Fragment } from 'react';
import { useIsEuRegion } from '@deriv/api';
import { CFDSection, OptionsAndMultipliersSection } from '..';

const TradersHubContent = () => {
    const { isEU } = useIsEuRegion();

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
