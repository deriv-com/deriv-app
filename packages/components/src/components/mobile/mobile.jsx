import { isMobile } from 'deriv-shared/utils/screen';

const Mobile = ({ children }) => {
    if (!isMobile()) return null;

    return children;
};

export default Mobile;
