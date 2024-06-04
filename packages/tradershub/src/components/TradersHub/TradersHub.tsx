import React, { Fragment } from 'react';
import { AppContainer, EUDisclaimerMessage } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { TradersHubRoute } from '@/routes';

const TradersHub = () => {
    const { isEU } = useRegulationFlags();

    return (
        <Fragment>
            <AppContainer>
                <TradersHubRoute />
            </AppContainer>
            {isEU && <EUDisclaimerMessage />}
        </Fragment>
    );
};

export default TradersHub;
