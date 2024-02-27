import React, { Fragment } from 'react';
import { useDevice } from '@deriv-com/ui';

type TResponsiveWrapperProps = {
    children: {
        desktop: React.ReactNode;
        mobile: React.ReactNode;
    };
};

export const ResponsiveWrapper = ({ children }: TResponsiveWrapperProps) => {
    const { isDesktop, isMobile } = useDevice();

    return (
        <Fragment>
            {isMobile && children.mobile}
            {isDesktop && children.desktop}
        </Fragment>
    );
};
