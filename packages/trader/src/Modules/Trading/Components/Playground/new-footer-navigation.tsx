import React from 'react';
import { Icon } from '@deriv/components';

const NewFooterNavigation = () => (
    <div className='footer-new_navigation'>
        <div className='footer-new_navigation_icon footer-new_navigation_icon-selected'>
            <Icon icon='IcNewTradeMenu' size={24} />
        </div>
        <div className='footer-new_navigation_icon'>
            <Icon icon='IcNewBasket' size={24} />
        </div>
        <div className='footer-new_navigation_icon'>
            <Icon icon='IcNewClock' size={24} />
        </div>
        <div className='footer-new_navigation_icon'>
            <Icon icon='IcNewLearn' size={24} />
        </div>
        <div className='footer-new_navigation_icon'>
            <Icon icon='IcNewMenu' size={24} />
        </div>
    </div>
);

export default NewFooterNavigation;
