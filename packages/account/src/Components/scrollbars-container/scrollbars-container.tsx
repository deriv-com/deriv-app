import classNames from 'classnames';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';

type TScrollbarsContainer = {
    className?: string;
    scroll_offset?: string;
};

export const ScrollbarsContainer = ({
    children,
    className,
    scroll_offset,
}: React.PropsWithChildren<TScrollbarsContainer>) => (
    <ThemedScrollbars is_bypassed={isMobile()} height={scroll_offset ? `calc(100% - ${scroll_offset})` : '100%'}>
        <div
            className={classNames('account__scrollbars_container', className)}
            data-testid='dt_scrollbar_container_div'
        >
            {children}
        </div>
    </ThemedScrollbars>
);
