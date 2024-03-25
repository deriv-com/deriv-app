import React from 'react';
import { SideNote } from '@deriv-com/ui';

export const ConnectedAppsSidebar = () => {
    const openAPIManagingWebsite = () => {
        window.open(
            'https://community.deriv.com/t/api-tokens-managing-access-on-third-party-applications-and-mobile-apps/29159',
            '_blank',
            'noopener'
        );
    };
    const openDerivAPIWebsite = () => {
        window.open('https://api.deriv.com/', '_blank', 'noopener');
    };
    return (
        <div className='flex flex-col items-center gap-16'>
            <SideNote
                actionClassName='mb-8 mt-16'
                actionClick={() => openAPIManagingWebsite()}
                actionLabel='Learn more'
                className='w-auto text-sm'
                title='Want to know more about APIs?'
            >
                Go to our Deriv community and learn about APIs, API tokens, ways to use Deriv APIs, and more.
            </SideNote>
            <SideNote
                actionClassName='mb-8 mt-16'
                actionClick={() => openDerivAPIWebsite()}
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
