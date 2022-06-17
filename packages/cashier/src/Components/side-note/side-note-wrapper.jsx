import React from 'react';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const SideNoteWrapper = ({ children, is_mobile }) => {
    return (
        <>
            {is_mobile && <MobileWrapper>{children}</MobileWrapper>}
            {!is_mobile && <DesktopWrapper>{children}</DesktopWrapper>}
        </>
    );
};

export default SideNoteWrapper;
