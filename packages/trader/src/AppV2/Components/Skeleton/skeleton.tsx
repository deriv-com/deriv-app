import clsx from 'clsx';
import React from 'react';

type TSkeletonProps = {
    animated?: boolean;
    className?: string;
    height?: string;
    variant?: 'icon';
    width?: string;
};

export const VARIANT = {
    ICON: 'icon',
} as const;

const Skeleton = ({ animated = true, className, height, width, variant }: TSkeletonProps) => {
    const getDefaultSize = () => (variant === VARIANT.ICON ? '32px' : '100%');

    const style: React.CSSProperties = {
        width: width ?? getDefaultSize(),
        height: height ?? getDefaultSize(),
    };

    return <div className={clsx(className, 'skeleton', animated && 'animated')} style={style} />;
};

export default Skeleton;
