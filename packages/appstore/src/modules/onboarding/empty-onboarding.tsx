import React from 'react';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';

const EmptyOnboarding = () => {
    return (
        <div className='empty-onboarding__wrapper' data-testid='dt_empty_onboarding'>
            <div className='empty-onboarding__header'>
                <TradingPlatformIconProps icon='DerivLogo' />
            </div>
        </div>
    );
};

export default EmptyOnboarding;
