import React, { CSSProperties } from 'react';
import { GradientBackgroundTwoPoint } from '../gradient-background-two-point';
import './wallet-icon.scss';

type TWalletIcon = {
    icon: JSX.Element;
    primary_color: CSSProperties['backgroundColor'];
    secondary_color: CSSProperties['backgroundColor'];
    // size?: 'small' | 'normal' | 'medium' | 'large';
    size?: number;
    className?: string;
};

// const getBlurRadius = (size: string) => {
//     if (size === 'small') return 16;
//     if (size === 'normal') return 24;
//     if (size === 'medium') return 32;

//     return 48;
// };

const WalletIcon = ({ icon, primary_color, secondary_color, size = 24, className }: TWalletIcon) => {
    return (
        <div className={`wallet-icon wallet-icon--${size} ${className}`}>
            <div className='wallet-icon__background'>
                <GradientBackgroundTwoPoint
                    blurRadius={size}
                    backgroundColor='var(--general-main-2)'
                    primaryColor={primary_color}
                    secondaryColor={secondary_color}
                >
                    {icon}
                </GradientBackgroundTwoPoint>
            </div>
        </div>
    );
};

export default WalletIcon;
