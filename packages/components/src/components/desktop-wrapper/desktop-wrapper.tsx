import { ReactNode } from 'react';
import { isDesktop } from '@deriv/shared';

type TDesktopProps = {
    children: ReactNode;
};

const Desktop = ({ children }: TDesktopProps) => {
    if (!isDesktop()) return null;
    return children;
};

export default Desktop;
