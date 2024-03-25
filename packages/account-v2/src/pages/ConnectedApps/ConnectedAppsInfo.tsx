import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';

export const ConnectedAppsInfo = () => {
    return (
        <InlineMessage iconPosition='top' variant='info'>
            <div>
                <Text as='h4' size='xs' weight='bold'>
                    What are connected apps?
                </Text>
                <Text
                    as='ol'
                    className='flex flex-col md:gap-14 sm:gap-10 list-decimal md:pt-14 md:pl-14 sm:pt-10 sm:pl-10 md:text-sm sm:text-xs'
                >
                    <li>
                        Connected apps are authorised applications associated with your account through your API token
                        or the OAuth authorisation process. They can act on your behalf within the limitations that you
                        have set.
                    </li>
                    <li>
                        As a user, you are responsible for sharing access and for actions that occur in your account
                        (even if they were initiated by a third-party app on your behalf).
                    </li>
                    <li>
                        Please note that only third-party apps will be displayed on this page. Official Deriv apps will
                        not appear here.
                    </li>
                </Text>
            </div>
        </InlineMessage>
    );
};
