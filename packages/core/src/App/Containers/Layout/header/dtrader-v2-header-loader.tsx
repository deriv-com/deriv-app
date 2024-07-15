import React from 'react';
import { Skeleton, VARIANT } from '@deriv/components';

type TDTraderV2HeaderLoaderProps = {
    show_notifications_skeleton?: boolean;
};

const DTraderV2HeaderLoader = ({ show_notifications_skeleton = true }: TDTraderV2HeaderLoaderProps) => (
    <div className='header-v2__loader' data-testid='dt_header_loader'>
        <Skeleton width={144} height={36} />
        {show_notifications_skeleton && <Skeleton variant={VARIANT.ICON} />}
    </div>
);

export default DTraderV2HeaderLoader;
