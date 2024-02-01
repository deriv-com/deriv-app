import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { PageLayout, Text } from '@deriv-com/ui';
import { TRouteComponent } from '../../constants/routesConfig';

const MenuOptions = ({ routes }: Pick<TRouteComponent, 'routes'>) => {
    return (
        <div className='flex min-w-[278px] flex-col rounded-400 bg-[#f2f3f4] p-400'>
            {routes?.map(route => {
                return (
                    <div className='px-800 py-500' key={route.path}>
                        <Text size='sm' weight='bold'>
                            <NavLink activeClassName='text-solid-red-500' to={route.path}>
                                {route.title}
                            </NavLink>
                        </Text>
                    </div>
                );
            })}
        </div>
    );
};

const Cashier = ({ routes }: TRouteComponent) => {
    return (
        <div className='max-w-screen-xl mx-auto'>
            <PageLayout left={<MenuOptions routes={routes} />}>
                <div className='ml-1200 max-w-[740px] bg-solid-red-500 px-1200'>
                    <Switch>
                        {routes?.map(route => {
                            return (
                                <Route exact key={route.path} path={route.path}>
                                    <route.component {...route} />
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
