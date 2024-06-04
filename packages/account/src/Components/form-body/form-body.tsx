import React from 'react';
import { ScrollbarsContainer } from '../scrollbars-container/scrollbars-container';
import { Div100vhContainer } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import clsx from 'clsx';

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
                    className={clsx('account__scrollbars_container--grid-layout', className)}
                    scroll_offset={scroll_offset}
                    isFullHeight={isFullHeight}
                >
                    {children}
                </ScrollbarsContainer>
            ) : (
                <Div100vhContainer
                    className={clsx('account__scrollbars_container--grid-layout', className)}
                    height_offset={scroll_offset || '200px'}
                >
                    {children}
                </Div100vhContainer>
            )}
        </React.Fragment>
    );
};
