import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useAuthorize } from '@deriv/api-v2';
import { Loader, PageLayout, VerticalTab, VerticalTabItems } from '@deriv-com/ui';
import type { TRouteTypes } from '../../types';
import styles from './Cashier.module.scss';

const Cashier: React.FC<TRouteTypes.TRouteComponent> = ({ routes }) => {
    const routesWithID = routes?.map(route => ({ ...route, id: route.path })) ?? [];
    const { isLoading } = useAuthorize();
    const history = useHistory();

    const onSelectItemHandler = (path: TRouteTypes.TRoutes) => history.push(path);

    if (isLoading) return <Loader />;

    return (
        <div className={styles.container}>
            <PageLayout
                sidebar={
                    <VerticalTab>
                        <VerticalTabItems
                            activeTab={history.location.pathname}
                            items={routesWithID}
                            //@ts-expect-error VerticalTabItems should have generic type for "id" prop and not limited to the type of string
                            onSelectItem={onSelectItemHandler}
                            should_have_panel={false}
                            wrapperClassName={styles['vertical-tab-wrapper']}
                        />
                    </VerticalTab>
                }
            >
                <Switch>
                    {routes?.map(route => {
                        const { path, title } = route;
                        return (
                            <Route exact key={path} path={path}>
                                <route.component path={path} routes={routes} title={title} />
                            </Route>
                        );
                    })}
                </Switch>
            </PageLayout>
        </div>
    );
};

export default Cashier;
