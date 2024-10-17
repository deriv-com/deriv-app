import React from 'react';
import classNames from 'classnames';
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
    ({ children, hide_breadcrumb = false, left, right }) => {
        const {
            client,
            common: { is_from_outside_cashier },
        } = useStore();
        const { isDesktop } = useDevice();
        const { is_authorize } = client;
        const is_loading = !is_authorize;

        return (
            <div
                className={classNames('page-container', {
                    'page-container--modal': is_from_outside_cashier,
                })}
            >
                {is_loading && <Loading is_fullscreen={false} />}
                {!is_loading && (
                    <div className='page-container__content'>
                        {!is_from_outside_cashier && isDesktop && left && (
                            <div className='page-container__sidebar--left'>{left}</div>
                        )}
                        <ThemedScrollbars
                            className={classNames('page-container__main', {
                                'page-container__main--modal': is_from_outside_cashier,
                            })}
                            height='calc(100svh - 8rem)'
                            is_scrollbar_hidden
                        >
                            {!hide_breadcrumb && <CashierBreadcrumb />}
                            {!is_from_outside_cashier && !isDesktop && left && (
                                <div className='page-container__sidebar--left'>{left}</div>
                            )}
                            {children}
                            {!is_from_outside_cashier && !isDesktop && right && (
                                <div className='page-container__sidebar--right'>{right}</div>
                            )}
                        </ThemedScrollbars>
                        {!is_from_outside_cashier && isDesktop && right && (
                            <div className='page-container__sidebar--right'>{right}</div>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

export default PageContainer;
