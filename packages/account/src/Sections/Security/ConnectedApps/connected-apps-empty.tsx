import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { CONNECTED_APPS_INFO_BULLETS } from 'Constants/connected-apps-config';

const ConnectedAppsEmpty = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const text_size = is_mobile ? 'xxxs' : 'xxs';

    return (
        <div className='connected-apps__empty--wrapper'>
            <Text size={text_size} align='center' weight='bold'>
                <Localize i18n_default_text="You currently don't have any third-party authorised apps associated with your account." />
            </Text>
            <div className='connected-apps__empty--bullets'>
                {CONNECTED_APPS_INFO_BULLETS.map(bullet => (
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
