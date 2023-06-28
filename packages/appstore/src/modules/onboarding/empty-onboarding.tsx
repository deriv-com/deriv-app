import React from 'react';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';

const EmptyOnboarding = () => {
    return (
        <div className='empty-onboarding__wrapper'>
            <div className='empty-onboarding__header'>
                <TradigPlatformIconProps icon='DerivLogo' />
            </div>
        </div>
    );
};

export default EmptyOnboarding;
