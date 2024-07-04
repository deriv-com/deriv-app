import React from 'react';
import { Skeleton, VARIANT } from '@deriv/components';
import { StandaloneBellRegularIcon } from '@deriv/quill-icons';

type TNotificationsIconProps = {
    is_loading?: boolean;
};

const NotificationsIconDTraderV2 = ({ is_loading }: TNotificationsIconProps) =>
    is_loading ? (
        <Skeleton variant={VARIANT.ICON} />
    ) : (
        <StandaloneBellRegularIcon iconSize='sm' className='notifications__icon' />
    );

export default NotificationsIconDTraderV2;
