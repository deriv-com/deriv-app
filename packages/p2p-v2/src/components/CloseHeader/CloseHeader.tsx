import React from 'react';
import { useDevice } from '../../hooks';
import CrossIcon from '../../public/ic-cross.svg';
import './CloseHeader.scss';
import { Text } from '@deriv-com/ui/dist/components/Text';

const CloseHeader = () => {
    const { isMobile } = useDevice();

    return (
        <div className='p2p-v2-close-header'>
            <Text size={isMobile ? 'md' : 'xl'} weight='bold'>
                {isMobile ? 'Deriv P2P' : 'Cashier'}
            </Text>
            <CrossIcon className='p2p-v2-close-header--icon' onClick={() => window.history.back()} />
        </div>
    );
};

export default CloseHeader;
