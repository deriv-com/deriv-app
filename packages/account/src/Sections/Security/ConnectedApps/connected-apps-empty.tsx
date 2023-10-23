import React from 'react';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import ConnectedAppsInfoBullets from './connected-apps-info-bullets';

const ConnectedAppsEmpty = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const title_text_size = is_mobile ? 'xxs' : 'xs';
    const bullets_text_size = is_mobile ? 'xxxs' : 'xxs';

    return (
        <div className='connected-apps__empty--wrapper'>
            <Text size={title_text_size} align='center' weight='bold'>
                <Localize i18n_default_text="You currently don't have any third-party authorised apps associated with your account." />
            </Text>
            <ConnectedAppsInfoBullets
                class_name_dynamic_suffix='without-apps'
                text_size={bullets_text_size}
                text_color='primary'
            />
        </div>
    );
});

export default ConnectedAppsEmpty;
