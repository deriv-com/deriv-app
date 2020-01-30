import React             from 'react';
import { Icon }          from '@deriv/components';
import { ToggleDrawer }  from '../../Elements/Drawer';
import MenuDrawer        from '../../../Containers/Drawer/menu-drawer.jsx';

const ToggleMenuDrawer = () => (
    <ToggleDrawer
        alignment='left'
        icon={<Icon icon='IcHamburger' size={24} />}
        icon_class='header__menu-toggle'
    >
        <MenuDrawer />
    </ToggleDrawer>
);

export default ToggleMenuDrawer;
