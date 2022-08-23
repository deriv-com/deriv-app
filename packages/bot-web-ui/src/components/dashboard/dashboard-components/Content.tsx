import React from 'react';
import Card from './Card';

const ContentBot = () => {
    return (
        <div className='dc-tabs__content_group'>
            <span className='dc-tabs__content_group_heading'>Load or build your bot</span>
            <span className='dc-tabs__content_group_description'>
                Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.
            </span>
            <Card />
        </div>
    );
};

export default ContentBot;
