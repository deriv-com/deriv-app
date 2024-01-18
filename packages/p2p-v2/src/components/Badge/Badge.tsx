import React, { memo } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './Badge.scss';

type TBadgeProps = {
    label: string;
    status: string;
    variant: 'general' | 'success' | 'warning';
};

const Badge = ({ label, status, variant }: TBadgeProps) => {
    return (
        <div
            className={clsx('p2p-v2-badge', {
                'p2p-v2-badge--success': variant === 'success',
                'p2p-v2-badge--warning': variant === 'warning',
                'p2p-v2-badge--general': variant === 'general',
            })}
        >
            <Text className='p2p-v2-badge__label' color='white' weight='bold'>
                {label}
            </Text>
            <Text className='p2p-v2-badge__status' color='white'>
                {status}
            </Text>
        </div>
    );
};

export default memo(Badge);
