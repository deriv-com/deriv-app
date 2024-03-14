import React, { memo } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import './Badge.scss';

type TBadgeProps = {
    label?: string;
    status?: string;
    tradeCount?: number | undefined;
    variant?: 'general' | 'success' | 'warning';
};

const Badge = ({ label, status, tradeCount, variant }: TBadgeProps) => {
    const textColor = variant === 'general' ? 'less-prominent' : 'white';

    if (tradeCount) {
        return (
            <div
                className={clsx('p2p-v2-badge', {
                    'p2p-v2-badge--gold': tradeCount >= 100 && tradeCount < 250,
                    'p2p-v2-badge--green': tradeCount >= 250,
                })}
            >
                <Text className='p2p-v2-badge__label' color='white' weight='bold'>
                    {`${tradeCount >= 250 ? '250+' : '100+'}`}
                </Text>
            </div>
        );
    }
    return (
        <div
            className={clsx('p2p-v2-badge', {
                'p2p-v2-badge--general': variant === 'general',
                'p2p-v2-badge--success': variant === 'success',
                'p2p-v2-badge--warning': variant === 'warning',
            })}
        >
            <Text className='p2p-v2-badge__label' color={textColor} weight='bold'>
                {label}
            </Text>
            <Text className='p2p-v2-badge__status' color={textColor}>
                {status}
            </Text>
        </div>
    );
};

export default memo(Badge);
