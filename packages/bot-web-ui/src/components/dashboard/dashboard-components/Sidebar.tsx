import React from 'react';
import { Icon } from '@deriv/components';
import Translations from './Translations';

const { IntroSideBarContentText } = Translations;

interface SideBarProps {
    checkIfSidebarOpen: boolean;
    setSideBarState: (state: boolean) => void;
}

const Sidebar = (props: SideBarProps) => {
    const { setSideBarState, checkIfSidebarOpen } = props;
    const sidebarClass = 'side_bar_container ';
    const sidebarClasstoggle = checkIfSidebarOpen ? 'side_bar_container_block' : 'side_bar_container_none';

    return (
        <div className={sidebarClass + sidebarClasstoggle}>
            <div className='side_bar_container_close_sidebar'>
                <Icon
                    className='dc-tabs__content_group_tiles_images'
                    width='1rem'
                    height='1rem'
                    style={{ backgroundColor: `#F2F3F4` }}
                    icon='IcCloseIconDbot'
                    onClick={() => {
                        setSideBarState(false);
                    }}
                />
            </div>
            {IntroSideBarContentText.map((IntroSideBar, index) => {
                const { headerText, ParaText, ParaSubText, ParaSubTextTwo } = IntroSideBar;
                return (
                    <div className='side_bar_container_para' key={index}>
                        <h1>{headerText}</h1>
                        <p>{ParaText}</p>
                        <p>{ParaSubText}</p>
                        <p>{ParaSubTextTwo}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar;
