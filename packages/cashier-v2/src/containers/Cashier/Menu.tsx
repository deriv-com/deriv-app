import React from 'react';
import { NavLink } from 'react-router-dom';
import { Text } from '@deriv-com/ui';
import { TRouteTypes } from '../../types';
import styles from './Menu.module.scss';

const Menu = ({ routes }: Pick<TRouteTypes.TRouteComponent, 'routes'>) => {
    return (
        <div className={styles.container}>
            {routes?.map(route => {
                return (
                    <div className={styles.navlinkWrapper} key={route.path}>
                        <Text size='sm' weight='bold'>
                            <NavLink activeClassName={styles.navlinkActive} to={route.path}>
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
