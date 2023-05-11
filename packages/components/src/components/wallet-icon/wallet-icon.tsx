import React, { CSSProperties } from 'react';
import { GradientBackgroundTwoPoint } from '../gradient-background-two-point';
import './wallet-icon.scss';

type TWalletIcon = {
    icon: JSX.Element;
    primaryColor: CSSProperties['backgroundColor'];
    secondaryColor: CSSProperties['backgroundColor'];
    size?: 'small' | 'medium' | 'large';
};

const getBlurRadius = (size: string) => {
    if (size === 'small') return 16;
    if (size === 'medium') return 24;

    return 48;
};

const WalletIcon = ({ icon, primaryColor, secondaryColor, size = 'medium' }: TWalletIcon) => {
    return (
        <div className={`wallet-icon wallet-icon--${size}`}>
            <div className='wallet-icon__background'>
                <GradientBackgroundTwoPoint
                    blurRadius={getBlurRadius(size)}
                    backgroundColor='var(--general-main-2)'
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                >
                    {icon}
                </GradientBackgroundTwoPoint>
            </div>
        </div>
    );
};

export default WalletIcon;
