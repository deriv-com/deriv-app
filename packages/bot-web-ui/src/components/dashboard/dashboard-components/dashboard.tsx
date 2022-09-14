import React from 'react';
import { localize } from '@deriv/translations';
import Cards from './cards';
import { Text } from '@deriv/components';

const Dashboard = () => {
    return (
        <div className='dc-tabs__content-group'>
            <div className='dc-tabs__content-group__header'>
                <Text color='prominent' line_height='xxl' size='sm' weight='bold'>
                    {localize('Load or build your bot')}
                </Text>
            </div>
            <div className='dc-tabs__content-group__description'>
                <Text color='prominent' line_height='s' size='s'>
                    {localize(
                        'Import bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                    )}
                </Text>
            </div>
            <Cards />
        </div>
    );
};

export default Dashboard;
