import React from 'react';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';

const EmptyOnboarding = () => {
    return (
        <div className='empty-onboarding-wrapper'>
            <div className='empty-onboarding-header'>
                <TradigPlatformIconProps icon='DerivTradingLogo' />
            </div>
        </div>
    );
};

export default EmptyOnboarding;
