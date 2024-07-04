import React from 'react';
import { Skeleton, VARIANT } from '../../skeleton';

type THeaderLoaderProps = {
    show_notifications_skeleton?: boolean;
};

const HeaderLoader = ({ show_notifications_skeleton }: THeaderLoaderProps) => (
    <div className='header-loader'>
        <Skeleton width={144} height={36} />
        {show_notifications_skeleton && <Skeleton variant={VARIANT.ICON} />}
    </div>
);

export default HeaderLoader;
