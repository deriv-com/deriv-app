import React, { PropsWithChildren } from 'react';
import useDevice from '../../hooks/useDevice';
import './DesktopWrapper.scss';

const DesktopWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    const { is_desktop } = useDevice();

    if (!is_desktop) return null;

    return <div className='wallets-desktop-wrapper'>{children}</div>;
};

export default DesktopWrapper;
