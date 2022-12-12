import React from 'react';
import WalletIcon from 'Assets/svgs/wallet';

const EmptyOnboarding = () => {
    return (
        <div className='empty-onboarding-wrapper'>
            <div className='empty-onboarding-header'>
                <WalletIcon icon='DerivTradingLogo' />
            </div>
        </div>
    );
};

export default EmptyOnboarding;
