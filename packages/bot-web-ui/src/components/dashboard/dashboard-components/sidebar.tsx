import React from 'react';
import { Icon } from '@deriv/components';
import classNames from 'classnames';
import { SIDEBAR_INTRO } from './constants';

type TSideBar = {
    is_sidebar_open: boolean;
    setSideBarState: (state: boolean) => void;
};

const Sidebar = ({ setSideBarState, is_sidebar_open }: TSideBar) => {
    return (
        <div
            className={classNames('db-sidebar', {
                'db-sidebar--block': is_sidebar_open,
            })}
        >
            <div className='db-sidebar__close-action'>
                <Icon
                    className='db-sidebar__images'
                    width='1rem'
                    height='1rem'
                    icon='IcCloseIconDbot'
                    onClick={() => {
                        setSideBarState(false);
                    }}
                />
            </div>
            {SIDEBAR_INTRO.map((sidebar_item, index) => {
                const { label, content } = sidebar_item;
                return (
                    <div className='db-sidebar__card' key={index}>
                        <h1>{label}</h1>
                        {content.map((text, key) => (
                            <p key={`sidebar-tour${key}`}>{text}</p>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar;
