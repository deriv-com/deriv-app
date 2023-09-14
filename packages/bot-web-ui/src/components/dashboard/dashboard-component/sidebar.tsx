import React from 'react';
import classNames from 'classnames';
import { Icon } from '@deriv/components';
import { SIDEBAR_INTRO } from './constants';
import IntroCard from './intro-card';

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
            {SIDEBAR_INTRO.map(sidebar_item => {
                const { label } = sidebar_item;
                return (
                    <React.Fragment key={label}>
                        <IntroCard sidebar_item={sidebar_item} />;
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Sidebar;
