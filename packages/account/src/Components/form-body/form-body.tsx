import { Div100vhContainer, DesktopWrapper, MobileWrapper } from '@deriv/components';
import React from 'react';
import { ScrollbarsContainer } from 'Components/scrollbars-container/scrollbars-container.jsx';

export const FormBody = ({ children, scroll_offset }) => (
    <React.Fragment>
        <DesktopWrapper>
            <ScrollbarsContainer className='account__scrollbars_container--grid-layout' scroll_offset={scroll_offset}>
                {children}
            </ScrollbarsContainer>
        </DesktopWrapper>
        <MobileWrapper>
            <Div100vhContainer
                className='account__scrollbars_container--grid-layout'
                height_offset={scroll_offset || '200px'}
            >
                {children}
            </Div100vhContainer>
        </MobileWrapper>
    </React.Fragment>
);
