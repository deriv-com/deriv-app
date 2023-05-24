import React from 'react';
import TradingPlatformIconProps from 'Assets/svgs/trading-platform';

const EmptyOnboarding = () => {
    return (
        <div className='empty-onboarding__wrapper'>
            <div className='empty-onboarding__header'>
                <TradingPlatformIconProps icon='DerivTradingLogo' />
            </div>
        </div>
    );
};

export default EmptyOnboarding;
