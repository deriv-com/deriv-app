import React from 'react';
import { AppContainer, EUDisclaimerMessage } from '@/components';
import { useRegulationFlags } from '@/hooks';
import { TradersHubRoute } from '@/routes';

const TradersHub = () => {
    const { isEU } = useRegulationFlags();

    return (
        <>
            <AppContainer>
                <TradersHubRoute />
            </AppContainer>
            {isEU && <EUDisclaimerMessage />}
        </>
    );
};

export default TradersHub;
