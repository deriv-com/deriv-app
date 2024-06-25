import clsx from 'clsx';
import React from 'react';

type TSkeletonProps = {
    animated?: boolean;
    width?: string;
    height?: string;
    variant?: 'icon';
};

export const VARIANT = {
    ICON: 'icon',
} as const;

const Skeleton = ({ animated = true, width, height, variant }: TSkeletonProps) => {
    const getDefaultSize = () => (variant === VARIANT.ICON ? '32px' : '100%');

    const style: React.CSSProperties = {
        width: width ?? getDefaultSize(),
        height: height ?? getDefaultSize(),
    };

    return <div className={clsx('skeleton', animated && 'animated')} style={style} />;
};

export default Skeleton;
