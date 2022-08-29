import React from 'react';
import { Icon } from '@deriv/components';
import Translations from './Translations';
import Joyride from 'react-joyride';

interface DashboardProps {
    steps: (state: boolean) => void;
}

const { IconArray } = Translations;

const Card = () => {
    return (
        <div className='dc-tabs__content_group_tiles' id='dc-tabs__content_group_tiles'>
            {IconArray.map((icons, index) => {
                const { icon, content } = icons;
                return (
                    <div key={index} className='dc-tabs__content_group_tiles_block'>
                        <Icon
                            className='dc-tabs__content_group_tiles_images'
                            width='8rem'
                            height='8rem'
                            style={{ backgroundColor: `#F2F3F4` }}
                            icon={icon}
                            id={icon}
                        />
                        <span className='dc-tabs__content_group_tiles_content'>{content}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default Card;
