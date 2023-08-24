import React, { CSSProperties } from 'react';
import './gradient-background-two-point.scss';

type TGradientBackgroundTwoPoint = {
    blur_radius?: number;
    backgroundColor: CSSProperties['backgroundColor'];
    primaryColor: CSSProperties['background'];
    secondaryColor: CSSProperties['background'];
};

const GradientBackgroundTwoPoint: React.FC<React.PropsWithChildren<TGradientBackgroundTwoPoint>> = ({
    children,
    blur_radius = 48,
    backgroundColor,
    primaryColor,
    secondaryColor,
}) => (
    <div className='gradient-background-two-point' style={{ backgroundColor }}>
        <div
            className='gradient-background-two-point__primary'
            style={{ filter: `blur(${blur_radius}px)`, background: primaryColor }}
        />
        <div
            className='gradient-background-two-point__secondary'
            style={{ filter: `blur(${blur_radius}px)`, background: secondaryColor }}
        />
        {children && <div className='gradient-background-two-point__children'>{children}</div>}
    </div>
);

export default GradientBackgroundTwoPoint;
