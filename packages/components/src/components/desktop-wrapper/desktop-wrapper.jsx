import { isDesktop } from '@deriv/shared/utils/screen';

const Desktop = ({ children }) => {
    if (!isDesktop()) return null;
    return children;
};

export default Desktop;
