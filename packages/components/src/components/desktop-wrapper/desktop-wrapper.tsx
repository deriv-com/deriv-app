import { isDesktop } from '@deriv/shared';

type TDesktopProps = {
    children: React.ReactNode;
};

const Desktop = ({ children }: TDesktopProps) => {
    if (!isDesktop()) return null;
    return children;
};

export default Desktop;
