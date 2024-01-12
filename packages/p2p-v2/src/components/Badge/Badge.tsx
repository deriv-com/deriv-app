import React from 'react';
import './Badge.scss';

type TBadgeProps = {
    label: string;
    status: string;
};

const Badge = ({ label, status }: TBadgeProps) => {
    return (
        <div className='p2p-v2-badge'>
            <span className='p2p-v2-badge__label'>{label}</span>
            <span className='p2p-v2-badge__status'>{status}</span>
        </div>
    );
};

export default memo(Badge);
