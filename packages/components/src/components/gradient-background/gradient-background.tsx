import React, { CSSProperties } from 'react';
import './gradient-background.scss';

type TProps = {
    color: CSSProperties['backgroundColor'];
    primary: CSSProperties['background'];
    secondary: CSSProperties['background'];
    tertiary: CSSProperties['background'];
};

const GradientBackground: React.FC<React.PropsWithChildren<TProps>> = ({
    children,
    color,
    primary,
    secondary,
    tertiary,
}) => (
    <div className='gradient-background'>
        <div className='gradient-background__container' style={{ backgroundColor: color }}>
            <div className='gradient-background__tertiary' style={{ background: tertiary }} />
            <div className='gradient-background__secondary' style={{ background: secondary }} />
            <div className='gradient-background__primary' style={{ background: primary }} />
            {children && <div className='gradient-background__children'>{children}</div>}
        </div>
    </div>
);

export default GradientBackground;
