import { isDesktop } from '@deriv/shared';
import React from 'react';

type TDesktopProps = {
    children: React.ReactNode;
};

const Desktop = ({ children }: TDesktopProps) => {
    if (!isDesktop()) return null;
    return <React.Fragment>{children}</React.Fragment>;
};

export default Desktop;
