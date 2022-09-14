import React from 'react';
import { localize } from '@deriv/translations';
import Cards from './cards';
import { Text } from '@deriv/components';

const Dashboard = () => {
    return (
        <div className='dc-tabs__content-group'>
            <span className='heading'>{localize('Load or build your bot')}</span>
            <Text color='prominent' line_height='s' size='s'>
                {localize(
                    'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                )}
            </Text>
            <Cards />
        </div>
    );
};

export default Dashboard;
