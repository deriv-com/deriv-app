import React from 'react';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import CashierBreadcrumb from '../cashier-breadcrumb';
import './page-container.scss';

type TProps = {
    hide_breadcrumb?: boolean;
    left?: JSX.Element;
    right?: JSX.Element;
};

const PageContainer: React.FC<React.PropsWithChildren<TProps>> = observer(
    ({ hide_breadcrumb = false, children, left, right }) => {
        const { client, ui } = useStore();
        const { is_desktop } = ui;
        const { is_authorize } = client;
        const is_loading = !is_authorize;

        return (
            <div className='page-container'>
                {is_loading && <Loading is_fullscreen={false} />}
                {!is_loading && (
                    <div className='page-container__content'>
                        {is_desktop && left && <div className='page-container__sidebar--left'>{left}</div>}
                        <ThemedScrollbars
                            className='page-container__main'
                            height='calc(100svh - 8rem)'
                            is_scrollbar_hidden
                        >
                            {!hide_breadcrumb && <CashierBreadcrumb />}
                            {!is_desktop && left && <div className='page-container__sidebar--left'>{left}</div>}
                            {children}
                            {!is_desktop && right && <div className='page-container__sidebar--right'>{right}</div>}
                        </ThemedScrollbars>
                        {is_desktop && <div className='page-container__sidebar--right'>{right}</div>}
                    </div>
                )}
            </div>
        );
    }
);

export default PageContainer;
