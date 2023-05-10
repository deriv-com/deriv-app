import React from 'react';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import CashierBreadcrumb from '../cashier-breadcrumb';
import './page-container.scss';

type TProps = {
    hide_breadcrumb?: boolean;
};

const PageContainer: React.FC<React.PropsWithChildren<TProps>> = observer(({ hide_breadcrumb = false, children }) => {
    const { client } = useStore();
    const { is_authorize } = client;
    const is_loading = !is_authorize;

    return (
        <div className='page-container'>
            {!hide_breadcrumb && <CashierBreadcrumb />}
            {is_loading && <Loading is_fullscreen={false} />}
            {!is_loading && <ThemedScrollbars>{children}</ThemedScrollbars>}
        </div>
    );
});

export default PageContainer;
