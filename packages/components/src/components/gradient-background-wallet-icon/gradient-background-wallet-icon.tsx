import React, { CSSProperties } from 'react';
import './gradient-background-wallet-icon.scss';

type TGradientBackgroundWalletIcon = {
    blurRadius?: number;
    color: CSSProperties['backgroundColor'];
    primary: CSSProperties['background'];
    secondary: CSSProperties['background'];
};

const GradientBackgroundWalletIcon: React.FC<React.PropsWithChildren<TGradientBackgroundWalletIcon>> = ({
    children,
    blurRadius = 48,
    color,
    primary,
    secondary,
}) => (
    <div className='gradient-background-wallet-icon' style={{ backgroundColor: color }}>
        <div
            className='gradient-background-wallet-icon__primary'
            style={{ filter: `blur(${blurRadius}px)`, background: primary }}
        />
        <div
            className='gradient-background-wallet-icon__secondary'
            style={{ filter: `blur(${blurRadius}px)`, background: secondary }}
        />
        {children && <div className='gradient-background-wallet-icon__children'>{children}</div>}
    </div>
);

export default GradientBackgroundWalletIcon;
