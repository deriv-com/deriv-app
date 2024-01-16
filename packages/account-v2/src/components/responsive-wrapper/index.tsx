import React from 'react';
import { useBreakpoint } from '@deriv/quill-design';

type TResponsiveWrapperProps = {
    children: {
        desktop: React.ReactNode;
        mobile: React.ReactNode;
    };
};

export const ResponsiveWrapper = ({ children }: TResponsiveWrapperProps) => {
    const { isDesktop, isMobile } = useBreakpoint();

    return (
        <React.Fragment>
            {isMobile && children.mobile}
            {isDesktop && children.desktop}
        </React.Fragment>
    );
};
