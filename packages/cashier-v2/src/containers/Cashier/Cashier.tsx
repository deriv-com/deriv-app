import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageLayout } from '@deriv-com/ui';
import { TRouteTypes } from '../../types';
import Menu from './Menu';

const Cashier = ({ routes }: TRouteTypes.TRouteComponent) => {
    return (
        <div className='max-w-screen-xl mx-auto'>
            <PageLayout sidebar={<Menu routes={routes} />}>
                <div className='px-1200 md:ml-1200'>
                    <Switch>
                        {routes?.map(route => {
                            const { path, title } = route;
                            return (
                                <Route exact key={route.path} path={route.path}>
                                    <route.component path={path} title={title} />
                                </Route>
                            );
                        })}
                    </Switch>
                </div>
            </PageLayout>
        </div>
    );
};

export default Cashier;
