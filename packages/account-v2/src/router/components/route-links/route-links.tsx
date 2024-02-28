import React from 'react';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import { defaultRoute, routes } from '../../constants/routesConfig';

const RouteLinks = () => (
    <BrowserRouter>
        <div className='px-200 py-800 gap-300 grid grid-cols-1 sm:grid-cols-[1fr_4fr]'>
            <div className='flex-col [display:none] sm:flex p-400 bg-solid-slate-75 rounded-200'>
                {routes.map(route => (
                    <NavLink
                        activeClassName='bg-solid-slate-100 border-solid border-l-200 border-l-solid-red-500 rounded-200 font-bold'
                        className='text-body-md p-400'
                        key={route.routePath}
                        to={route.routePath}
                    >
                        {route.routeName}
                    </NavLink>
                ))}
            </div>
            <div className='p-400'>
                <Switch>
                    {routes.map(route => {
                        const Component = route.routeComponent;
                        return (
                            <Route
                                exact
                                key={route.routePath}
                                path={route.routePath}
                                render={() => <Component path={route.routePath} />}
                            />
                        );
                    })}
                    <Redirect from='/' to={defaultRoute} />
                </Switch>
            </div>
        </div>
    </BrowserRouter>
);

export default RouteLinks;
