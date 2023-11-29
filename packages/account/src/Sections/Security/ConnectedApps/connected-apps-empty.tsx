import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import ConnectedAppsInfoBullets from './connected-apps-info-bullets';

const ConnectedAppsEmpty = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const text_size = is_mobile ? 'xxs' : 'xs';

    return (
        <div className='connected-apps__empty--wrapper'>
            <Text size={text_size} align='center' weight='bold'>
                <Localize i18n_default_text="You currently don't have any third-party authorised apps associated with your account." />
            </Text>
            <ConnectedAppsInfoBullets text_color='primary' class_name='connected-apps__bullets--without-apps' />
        </div>
    );
});

export default ConnectedAppsEmpty;
