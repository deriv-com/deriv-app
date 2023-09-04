import React, { PropsWithChildren } from 'react';
import useDevice from '../../hooks/useDevice';
import './MobileWrapper.scss';

const MobileWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    const { is_mobile } = useDevice();

    if (!is_mobile) return null;

    return <div className='wallets-mobile-wrapper'>{children}</div>;
};

export default MobileWrapper;
