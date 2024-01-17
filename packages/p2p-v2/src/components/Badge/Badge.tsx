import React, { memo } from 'react';
import clsx from 'clsx';
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
            <span className='p2p-v2-badge__label'>{label}</span>
            <span className='p2p-v2-badge__status'>{status}</span>
        </div>
    );
};

export default memo(Badge);
