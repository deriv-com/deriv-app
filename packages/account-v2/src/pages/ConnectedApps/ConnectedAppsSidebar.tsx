import React from 'react';
import { SideNote } from '@deriv-com/ui';
import { API_MANAGING_WEBSITE, PRODUCT_API } from '../../constants/connectedAppsConstants';

export const ConnectedAppsSidebar = () => {
    const openAPIManagingWebsite = () => {
        window.open(API_MANAGING_WEBSITE, '_blank', 'noopener noreferrer');
    };
    const openDerivAPIWebsite = () => {
        window.open(PRODUCT_API, '_blank', 'noopener noreferrer');
    };
    return (
        <div className='flex flex-col items-center gap-16'>
            <SideNote
                actionClassName='mt-16'
                actionClick={openAPIManagingWebsite}
                actionLabel='Learn more'
                className='w-auto text-sm'
                title='Want to know more about APIs?'
            >
                Go to our Deriv community and learn about APIs, API tokens, ways to use Deriv APIs, and more.
            </SideNote>
            <SideNote
                actionClassName='mt-16'
                actionClick={openDerivAPIWebsite}
                actionLabel='Learn more'
                className='w-auto text-sm'
                title='Earn more with Deriv API'
            >
                Use our powerful, flexible, and free API to build a custom trading platform for yourself or for your
                business.
            </SideNote>
        </div>
    );
};
