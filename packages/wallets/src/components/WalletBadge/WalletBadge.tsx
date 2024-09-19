import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import './WalletBadge.scss';

type TWalletBadgeProps = {
    children: React.ReactNode;
};

const WalletBadge = ({ children }: TWalletBadgeProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='wallets-badge'>
            <Text color='black' size={isMobile ? 'sm' : 'xs'}>
                {children}
            </Text>
        </div>
    );
};

export default WalletBadge;
