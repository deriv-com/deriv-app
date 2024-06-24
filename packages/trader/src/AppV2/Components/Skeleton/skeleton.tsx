import clsx from 'clsx';
import React from 'react';

type TSkeletonProps = {
    animated?: boolean;
    width?: string;
    height?: string;
};

const Skeleton = ({ animated = true, width, height }: TSkeletonProps) => {
    const style: React.CSSProperties = {
        width: width ?? '100%',
        height: height ?? '100%',
    };

    return <div className={clsx('skeleton', animated && 'animated')} style={style} />;
};

export default Skeleton;
