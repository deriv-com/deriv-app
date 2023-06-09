import React, { useCallback } from 'react';
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
        const { is_mobile } = ui;
        const { is_authorize } = client;
        const is_loading = !is_authorize;

        const LeftSideContent = useCallback(
            () => (left ? <div className='page-container__left'>{left}</div> : <></>),
            [left]
        );

        const RightSideContent = useCallback(
            () => (right ? <div className='page-container__right'>{right}</div> : <></>),
            [right]
        );

        return (
            <div className='page-container'>
                {is_loading && <Loading is_fullscreen={false} />}
                {!is_loading && (
                    <div className='page-container__content'>
                        {!is_mobile && <LeftSideContent />}
                        <ThemedScrollbars className='page-container__main'>
                            {!hide_breadcrumb && <CashierBreadcrumb />}
                            {is_mobile && <LeftSideContent />}
                            {children}
                            {is_mobile && <RightSideContent />}
                        </ThemedScrollbars>
                        {!is_mobile && <RightSideContent />}
                    </div>
                )}
            </div>
        );
    }
);

export default PageContainer;
