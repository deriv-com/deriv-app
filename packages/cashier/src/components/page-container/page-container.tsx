import React from 'react';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import './page-container.scss';

const PageContainer: React.FC<React.PropsWithChildren<unknown>> = observer(({ children }) => {
    const { client } = useStore();
    const { is_authorize } = client;

    return (
        <ThemedScrollbars className='page-container'>
            <div className='page-container__content'>{is_authorize ? children : <Loading is_fullscreen={false} />}</div>
        </ThemedScrollbars>
    );
});

export default PageContainer;
