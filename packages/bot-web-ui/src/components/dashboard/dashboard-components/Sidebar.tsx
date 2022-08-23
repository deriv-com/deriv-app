import React from 'react';
import { Icon } from '@deriv/components';
import Translations from './Translations';

const { IntroSideBarContentText } = Translations;

const Sidebar = () => {
    return (
        <div className='side_bar_container'>
            <div className='side_bar_container_close_sidebar'>
                <Icon
                    className='dc-tabs__content_group_tiles_images'
                    width='1rem'
                    height='1rem'
                    style={{ backgroundColor: `#F2F3F4` }}
                    icon='IcCloseIconDbot'
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
