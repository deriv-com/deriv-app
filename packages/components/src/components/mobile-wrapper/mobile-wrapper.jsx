import { isMobile } from '@deriv/shared/utils/screen';

const MobileWrapper = ({ children }) => {
    if (!isMobile()) return null;

    return children;
};

export default MobileWrapper;
