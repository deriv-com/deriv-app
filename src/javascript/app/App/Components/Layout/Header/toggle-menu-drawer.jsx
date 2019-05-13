import React             from 'react';
import { Icon }          from 'Assets/Common';
import { IconHamburger } from 'Assets/Header/NavBar';
import { ToggleDrawer }  from '../../Elements/Drawer';
import MenuDrawer        from '../../../Containers/Drawer/menu-drawer.jsx';

const ToggleMenuDrawer = () => (
    <ToggleDrawer
        alignment='left'
        icon={<Icon icon={IconHamburger} />}
        icon_class='header__menu-toggle'
    >
        <MenuDrawer />
    </ToggleDrawer>
);

export { ToggleMenuDrawer };
