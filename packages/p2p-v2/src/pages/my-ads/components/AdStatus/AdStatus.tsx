import React from 'react';
import { Text } from '@deriv-com/ui';
import { useDevice } from '../../../../hooks';
import './AdStatus.scss';

type TAdStatusProps = {
    isActive?: boolean;
};

const AdStatus = ({ isActive = false }: TAdStatusProps) => {
    const { isMobile } = useDevice();
    if (!isActive) {
        return (
            <Text
                align='center'
                className='p2p-v2-ad-status--inactive'
                color='error'
                size={isMobile ? 'md' : 'sm'}
                weight='bold'
            >
                Inactive
            </Text>
        );
    }

    return (
        <Text
            align='center'
            className='p2p-v2-ad-status--active'
            color='success'
            size={isMobile ? 'md' : 'sm'}
            weight='bold'
        >
            Active
        </Text>
    );
};

export default AdStatus;
