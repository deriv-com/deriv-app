import React from 'react';
import { NavLink } from 'react-router-dom';
import { Text } from '@deriv-com/ui';
import { TRouteTypes } from '../../types';

const Menu = ({ routes }: Pick<TRouteTypes.TRouteComponent, 'routes'>) => {
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

export default Menu;
