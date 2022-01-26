import { isMobile } from '@deriv/shared';

const MobileWrapper = ({ children }) => {
    if (!isMobile()) return null;

    return children;
};

export default MobileWrapper;
