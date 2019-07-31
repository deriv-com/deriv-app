import React             from 'react';
import Icon              from 'Assets/icon.jsx';
import { ToggleDrawer }  from 'App/Components/Elements/Drawer';
import MenuDrawer        from 'App/Containers/Drawer/menu-drawer.jsx';

const ToggleMenuDrawer = () => (
    <ToggleDrawer
        alignment='left'
        icon={<Icon icon='IconHamburger' />}
        icon_class='header__menu-toggle'
    >
        <MenuDrawer />
    </ToggleDrawer>
);

export { ToggleMenuDrawer };
