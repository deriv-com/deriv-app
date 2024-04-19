import React from 'react';
import { SideNote } from '@deriv-com/ui';
import { API_MANAGING_WEBSITE, PRODUCT_API } from '../../constants/connectedAppsConstants';

export const ConnectedAppsSidebar = () => {
    const openWebsite = (websiteUrl: string) => window.open(websiteUrl, '_blank', 'noopener noreferrer');
    return (
        <div className='flex flex-col items-center gap-16'>
            <SideNote
                actionClassName='mt-16'
                actionClick={() => openWebsite(API_MANAGING_WEBSITE)}
                actionLabel='Learn more'
                className='w-auto text-sm'
                title='Want to know more about APIs?'
                titleClassName='mb-8'
            >
                Go to our Deriv community and learn about APIs, API tokens, ways to use Deriv APIs, and more.
            </SideNote>
            <SideNote
                actionClassName='mt-16'
                actionClick={() => openWebsite(PRODUCT_API)}
                actionLabel='Learn more'
                className='w-auto text-sm'
                title='Earn more with Deriv API'
                titleClassName='mb-8'
            >
                Use our powerful, flexible, and free API to build a custom trading platform for yourself or for your
                business.
            </SideNote>
        </div>
    );
};
