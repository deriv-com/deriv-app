import React from 'react';
import { ScrollbarsContainer } from '../scrollbars-container/scrollbars-container';
import { Div100vhContainer } from '@deriv/components';
import classNames from 'classnames';
import { useDevice } from '@deriv-com/ui';

type TFormBody = {
    scroll_offset?: string;
    className?: string;
    isFullHeight?: boolean;
};

export const FormBody = ({ children, scroll_offset, className, isFullHeight }: React.PropsWithChildren<TFormBody>) => {
    const { isDesktop } = useDevice();
    return (
        <React.Fragment>
            {isDesktop ? (
                <ScrollbarsContainer
                    className={classNames('account__scrollbars_container--grid-layout', className)}
                    scroll_offset={scroll_offset}
                    isFullHeight={isFullHeight}
                >
                    {children}
                </ScrollbarsContainer>
            ) : (
                <Div100vhContainer
                    className={classNames('account__scrollbars_container--grid-layout', className)}
                    height_offset={scroll_offset || '200px'}
                >
                    {children}
                </Div100vhContainer>
            )}
        </React.Fragment>
    );
};
