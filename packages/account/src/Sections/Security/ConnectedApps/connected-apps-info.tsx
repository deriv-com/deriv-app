import React from 'react';
import { InlineMessage, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { CONNECTED_APPS_INFO_BULLETS } from 'Constants/connected-apps-config';

const ConnectedAppsInfo = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const text_size = is_mobile ? 'xxxs' : 'xxs';

    return (
        <InlineMessage
            type='information'
            size='md'
            message={
                <React.Fragment>
                    <Text as='h4' weight='bold' size={text_size}>
                        <Localize i18n_default_text='What are connected apps?' />
                    </Text>
                    <ol className='connected-apps__list--ordered_list'>
                        {CONNECTED_APPS_INFO_BULLETS.map(bullet => (
                            <li key={bullet.key}>
                                <Text as='p' size={text_size}>
                                    {bullet.text}
                                </Text>
                            </li>
                        ))}
                    </ol>
                </React.Fragment>
            }
        />
    );
});

export default ConnectedAppsInfo;
