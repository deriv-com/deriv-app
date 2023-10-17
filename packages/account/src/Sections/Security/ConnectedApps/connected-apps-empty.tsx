import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const ConnectedAppsEmpty = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const text_size = is_mobile ? 'xxxs' : 'xxs';
    const bullets = [
        {
            key: 'key_1',
            bullet_number: <Localize i18n_default_text='1.' />,
            text: (
                <Localize i18n_default_text='Connected apps are authorised applications associated with your account through your API token or the OAuth authorisation process. They can act on your behalf within the limitations that you have set.' />
            ),
        },
        {
            key: 'key_2',
            bullet_number: <Localize i18n_default_text='2.' />,
            text: (
                <Localize i18n_default_text='As a user, you are responsible for sharing access and for actions that occur in your account (even if they were initiated by a third-party app on your behalf).' />
            ),
        },
        {
            key: 'key_3',
            bullet_number: <Localize i18n_default_text='3.' />,
            text: (
                <Localize i18n_default_text='Please note that only third-party apps will be displayed on this page. Official Deriv apps will not appear here.' />
            ),
        },
    ];

    return (
        <div className='connected-apps__empty--wrapper'>
            <Text size={text_size} align='center' weight='bold'>
                <Localize i18n_default_text="You currently don't have any third-party authorised apps associated with your account." />
            </Text>
            <div className='connected-apps__empty--bullets'>
                {bullets.map(bullet => (
                    <div key={bullet.key} className='connected-apps__empty--entry'>
                        <Text size={text_size} color='primary'>
                            {bullet.bullet_number}
                        </Text>
                        <Text size={text_size} color='primary'>
                            {bullet.text}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default ConnectedAppsEmpty;
