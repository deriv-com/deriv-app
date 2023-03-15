import React from 'react';
import { TradingPlatformIcon } from '@deriv/components';

const EmptyOnboarding = () => {
    return (
        <div className='empty-onboarding__wrapper'>
            <div className='empty-onboarding__header'>
                <TradingPlatformIcon icon='DerivTradingLogo' />
            </div>
        </div>
    );
};

export default EmptyOnboarding;
