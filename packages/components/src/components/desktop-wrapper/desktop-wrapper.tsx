import { isDesktop } from '@deriv/shared';

const Desktop = ({ children }) => {
    if (!isDesktop()) return null;
    return children;
};

export default Desktop;
