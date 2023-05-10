import React, { CSSProperties } from 'react';
import './gradient-background-wallet-icon.scss';

type TGradientBackgroundWalletIcon = {
    blurRadius?: number;
    backgroundColor: CSSProperties['backgroundColor'];
    primaryColor: CSSProperties['background'];
    secondaryColor: CSSProperties['background'];
};

const GradientBackgroundWalletIcon: React.FC<React.PropsWithChildren<TGradientBackgroundWalletIcon>> = ({
    children,
    blurRadius = 48,
    backgroundColor,
    primaryColor,
    secondaryColor,
}) => (
    <div className='gradient-background-wallet-icon' style={{ backgroundColor }}>
        <div
            className='gradient-background-wallet-icon__primary'
            style={{ filter: `blur(${blurRadius}px)`, background: primaryColor }}
        />
        <div
            className='gradient-background-wallet-icon__secondary'
            style={{ filter: `blur(${blurRadius}px)`, background: secondaryColor }}
        />
        {children && <div className='gradient-background-wallet-icon__children'>{children}</div>}
    </div>
);

export default GradientBackgroundWalletIcon;
