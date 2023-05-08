import React, { CSSProperties } from 'react';
import './gradient-background-wallet-icon.scss';
import classNames from 'classnames';

type TGradientBackgroundWalletIcon = {
    color: CSSProperties['backgroundColor'];
    primary: CSSProperties['background'];
    secondary: CSSProperties['background'];
    size: string;
};

const GradientBackgroundWalletIcon: React.FC<React.PropsWithChildren<TGradientBackgroundWalletIcon>> = ({
    children,
    color,
    primary,
    secondary,
    size,
}) => (
    <div
        className={classNames('gradient-background-wallet-icon', {
            [`gradient-background-wallet-icon--${size}`]: size,
        })}
        style={{ backgroundColor: color }}
    >
        <div className='gradient-background-wallet-icon__primary' style={{ background: primary }} />
        <div className='gradient-background-wallet-icon__secondary' style={{ background: secondary }} />
        {children && <React.Fragment>{children}</React.Fragment>}
    </div>
);

export default GradientBackgroundWalletIcon;
