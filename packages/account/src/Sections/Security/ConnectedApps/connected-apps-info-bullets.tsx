import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { CONNECTED_APPS_INFO_BULLETS } from 'Constants/connected-apps-config';

type TConnectedAppsInfoBulletsProps = {
    class_name_dynamic_suffix: string;
    text_color?: string;
};

const ConnectedAppsInfoBullets = observer(
    ({ class_name_dynamic_suffix, text_color }: TConnectedAppsInfoBulletsProps) => {
        const { ui } = useStore();
        const { is_mobile } = ui;

        const text_size = is_mobile ? 'xxxs' : 'xxs';

        return (
            <Text
                as='ol'
                size={text_size}
                color={text_color}
                className={classNames(
                    'connected-apps__bullets--list',
                    class_name_dynamic_suffix ? `connected-apps__bullets--${class_name_dynamic_suffix}` : ''
                )}
            >
                {CONNECTED_APPS_INFO_BULLETS.map(bullet => (
                    <li key={bullet.key}>{bullet.text}</li>
                ))}
            </Text>
        );
    }
);

export default ConnectedAppsInfoBullets;
