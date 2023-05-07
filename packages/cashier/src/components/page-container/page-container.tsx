import React from 'react';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './page-container.scss';

const PageContainer: React.FC<React.PropsWithChildren<unknown>> = observer(({ children }) => {
    const { client } = useStore();
    const { is_authorize } = client;

    return (
        <ThemedScrollbars className='page-container'>
            {is_authorize ? children : <Loading is_fullscreen={false} />}
        </ThemedScrollbars>
    );
});

export default PageContainer;
