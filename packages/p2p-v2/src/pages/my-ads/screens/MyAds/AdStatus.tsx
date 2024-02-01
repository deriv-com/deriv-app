import React from 'react';
import { Text } from '@deriv-com/ui';
import './AdStatus.scss';

type TAdStatusProps = {
    isActive?: boolean;
};

const AdStatus = ({ isActive = false }: TAdStatusProps) => {
    if (!isActive) {
        return (
            <Text align='center' className='p2p-v2-ad-status--inactive' color='error' size='sm' weight='bold'>
                Inactive
            </Text>
        );
    }

    return (
        <Text align='center' className='p2p-v2-ad-status--active' color='success' size='sm' weight='bold'>
            Active
        </Text>
    );
};

export default AdStatus;
