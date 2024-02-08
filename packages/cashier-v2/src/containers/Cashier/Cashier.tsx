import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageLayout } from '@deriv-com/ui';
import { TRouteTypes } from '../../types';
import Menu from './Menu';
import styles from './Cashier.module.scss';

const Cashier = ({ routes }: TRouteTypes.TRouteComponent) => {
    return (
        <div className={styles.container}>
                <Switch>
                    {routes?.map(route => {
                        const { path, title } = route;
                        return (
                            <Route exact key={path} path={path}>
                                <route.component path={path} title={title} />
                            </Route>
                        );
                    })}
                </Switch>
            </PageLayout>
        </div>
    );
};

export default Cashier;
