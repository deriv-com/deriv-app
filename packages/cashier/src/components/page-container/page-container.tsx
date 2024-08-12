import React from 'react';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import './page-container.scss';

const CashierBreadcrumb = React.lazy(
    () => import(/* webpackChunkName: "cashier-breadcrumb" */ '../cashier-breadcrumb')
);

type TProps = {
    hide_breadcrumb?: boolean;
    left?: JSX.Element;
    right?: JSX.Element;
};

const PageContainer: React.FC<React.PropsWithChildren<TProps>> = observer(
    ({ hide_breadcrumb = false, children, left, right }) => {
        const { client } = useStore();
        const { isDesktop } = useDevice();
        const { is_authorize } = client;
        const is_loading = !is_authorize;

        return (
            <div className='page-container'>
                {is_loading && <Loading is_fullscreen={false} />}
                {!is_loading && (
                    <div className='page-container__content'>
                        {isDesktop && left && <div className='page-container__sidebar--left'>{left}</div>}
                        <ThemedScrollbars
                            className='page-container__main'
                            height='calc(100svh - 8rem)'
                            is_scrollbar_hidden
                        >
                            {!hide_breadcrumb && <CashierBreadcrumb />}
                            {!isDesktop && left && <div className='page-container__sidebar--left'>{left}</div>}
                            {children}
                            {!isDesktop && right && <div className='page-container__sidebar--right'>{right}</div>}
                        </ThemedScrollbars>
                        {isDesktop && right && <div className='page-container__sidebar--right'>{right}</div>}
                    </div>
                )}
            </div>
        );
    }
);

export default PageContainer;
