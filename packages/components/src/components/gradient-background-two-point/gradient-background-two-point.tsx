import React, { CSSProperties } from 'react';
import './gradient-background-two-point.scss';

type TGradientBackgroundTwoPoint = {
    blur_radius?: number;
    background_color: CSSProperties['backgroundColor'];
    primary_color: CSSProperties['background'];
    secondary_color: CSSProperties['background'];
};

const GradientBackgroundTwoPoint: React.FC<React.PropsWithChildren<TGradientBackgroundTwoPoint>> = ({
    children,
    blur_radius = 48,
    background_color,
    primary_color,
    secondary_color,
}) => (
    <div className='gradient-background-two-point' style={{ backgroundColor: background_color }}>
        <div
            className='gradient-background-two-point__primary'
            style={{ filter: `blur(${blur_radius}px)`, background: primary_color }}
        />
        <div
            className='gradient-background-two-point__secondary'
            style={{ filter: `blur(${blur_radius}px)`, background: secondary_color }}
        />
        {children && <div className='gradient-background-two-point__children'>{children}</div>}
    </div>
);

export default GradientBackgroundTwoPoint;
