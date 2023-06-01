import React from 'react';
import TradigPlatformIconProps from 'Assets/svgs/trading-platform';

const EmptyOnboarding = () => {
    return (
        <div className='empty-onboarding__wrapper'>
            <div className='empty-onboarding__header'>
                <TradigPlatformIconProps icon='DerivLogo' data-testid='deriv_trading_header' />
            </div>
        </div>
    );
};

export default EmptyOnboarding;
