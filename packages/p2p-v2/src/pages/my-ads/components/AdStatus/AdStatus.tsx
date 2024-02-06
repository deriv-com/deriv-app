import React from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import { useDevice } from '@/hooks';
import './AdStatus.scss';

type TAdStatusProps = {
    isActive?: boolean;
};

const AdStatus = ({ isActive = false }: TAdStatusProps) => {
    const { isMobile } = useDevice();
    return (
        <Text
            align='center'
            className={clsx({
                'p2p-v2-ad-status--active': isActive,
                'p2p-v2-ad-status--inactive': !isActive,
            })}
            color={isActive ? 'success' : 'error'}
            size={isMobile ? 'md' : 'sm'}
            weight='bold'
        >
            {isActive ? 'Active' : 'Inactive'}
        </Text>
    );
};

export default AdStatus;
