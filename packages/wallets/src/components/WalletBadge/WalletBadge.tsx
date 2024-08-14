import React from 'react';
import useDevice from '../../hooks/useDevice';
import { WalletText } from '../Base';
import './WalletBadge.scss';

type TWalletBadgeProps = {
    children: React.ReactNode;
};

const WalletBadge = ({ children }: TWalletBadgeProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='wallets-badge'>
            <WalletText color='black' size={isMobile ? 'sm' : 'xs'}>
                {children}
            </WalletText>
        </div>
    );
};

export default WalletBadge;
