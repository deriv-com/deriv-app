import { PropsWithChildren } from 'react';
import { isDesktop } from '@deriv/shared';

const Desktop = ({ children }: PropsWithChildren<never>) => {
    if (!isDesktop()) return null;
    return children;
};

export default Desktop;
