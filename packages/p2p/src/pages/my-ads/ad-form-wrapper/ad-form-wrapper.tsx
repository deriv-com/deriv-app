import { DesktopWrapper, Div100vhContainer, MobileWrapper } from '@deriv/components';
import React from 'react';

const AdFormWrapper = ({ children }: React.PropsWithChildren<unknown>) => {
    return (
        <React.Fragment>
            <MobileWrapper>
                <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>
            </MobileWrapper>
            <DesktopWrapper>{children}</DesktopWrapper>
        </React.Fragment>
    );
};

export default AdFormWrapper;
