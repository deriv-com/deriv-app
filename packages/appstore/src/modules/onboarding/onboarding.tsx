import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';

const Onboarding = observer(() => {
    const history = useHistory();
    const { client } = useStore();
    const { is_landing_company_loaded, is_logged_in } = client;

    if (is_logged_in && is_landing_company_loaded) {
        history.push(routes.traders_hub);
    }

    return (
        <div className='empty-onboarding__wrapper' data-testid='dt_empty_onboarding'>
            <div className='empty-onboarding__header'>
                <TradingPlatformIconProps icon='DerivLogo' />
            </div>
        </div>
    );
});

export default Onboarding;
