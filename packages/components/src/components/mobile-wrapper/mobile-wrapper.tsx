import React from 'react';
import { isMobile } from '@deriv/shared';

type TMobileWrapper = {
    children: React.ReactNode;
};

const MobileWrapper = ({ children }: TMobileWrapper) => {
    if (!isMobile()) return null;

    return <React.Fragment>{children}</React.Fragment>;
};

export default MobileWrapper;
