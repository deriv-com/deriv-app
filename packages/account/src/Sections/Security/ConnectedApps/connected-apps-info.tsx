import React from 'react';
import { InlineMessage, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const ConnectedAppsInfo = () => (
    <InlineMessage
        type='information'
        size='md'
        message={
            <React.Fragment>
                <Text as='h4' weight='bold' size='xs'>
                    <Localize i18n_default_text='What are connected apps?' />
                </Text>
                <ol className='connected-apps__list--ordered_list'>
                    <li>
                        <Text as='p' size='xxxs'>
                            <Localize i18n_default_text='Connected apps are authorised applications associated with your account through your API token or the OAuth authorisation process. They can act on your behalf within the limitations that you have set.' />
                        </Text>
                    </li>
                    <li>
                        <Text as='p' size='xxxs'>
                            <Localize i18n_default_text='As a user, you are responsible for sharing access and for actions that occur in your account (even if they were initiated by a third-party app on your behalf).' />
                        </Text>
                    </li>
                    <li>
                        <Text as='p' size='xxxs'>
                            <Localize i18n_default_text='Please note that only third-party apps will be displayed on this page. Official Deriv apps will not appear here.' />
                        </Text>
                    </li>
                </ol>
            </React.Fragment>
        }
    />
);

export default ConnectedAppsInfo;
