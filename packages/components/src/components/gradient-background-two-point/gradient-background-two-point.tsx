import React, { CSSProperties } from 'react';
import './gradient-background-two-point.scss';

type TGradientBackgroundTwoPoint = {
    blurRadius?: number;
    backgroundColor: CSSProperties['backgroundColor'];
    primaryColor: CSSProperties['background'];
    secondaryColor: CSSProperties['background'];
};

const GradientBackgroundTwoPoint: React.FC<React.PropsWithChildren<TGradientBackgroundTwoPoint>> = ({
    children,
    blurRadius = 48,
    backgroundColor,
    primaryColor,
    secondaryColor,
}) => (
    <div className='gradient-background-two-point' style={{ backgroundColor }}>
        <div
            className='gradient-background-two-point__primary'
            style={{ filter: `blur(${blurRadius}px)`, background: primaryColor }}
        />
        <div
            className='gradient-background-two-point__secondary'
            style={{ filter: `blur(${blurRadius}px)`, background: secondaryColor }}
        />
        {children && <div className='gradient-background-two-point__children'>{children}</div>}
    </div>
);

export default GradientBackgroundTwoPoint;
