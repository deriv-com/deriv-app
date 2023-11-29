import React from 'react';
import { ScrollbarsContainer } from '../scrollbars-container/scrollbars-container';
import { Div100vhContainer, DesktopWrapper, MobileWrapper } from '@deriv/components';
import classNames from 'classnames';

type TFormBody = {
    scroll_offset?: string;
    className?: string;
};

export const FormBody = ({ children, scroll_offset, className }: React.PropsWithChildren<TFormBody>) => (
    <React.Fragment>
        <DesktopWrapper>
            <ScrollbarsContainer
                className={classNames('account__scrollbars_container--grid-layout', className)}
                scroll_offset={scroll_offset}
            >
                {children}
            </ScrollbarsContainer>
        </DesktopWrapper>
        <MobileWrapper>
            <Div100vhContainer
                className={classNames('account__scrollbars_container--grid-layout', className)}
                height_offset={scroll_offset || '200px'}
            >
                {children}
            </Div100vhContainer>
        </MobileWrapper>
    </React.Fragment>
);
