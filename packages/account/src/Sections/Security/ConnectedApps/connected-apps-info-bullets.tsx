import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { CONNECTED_APPS_INFO_BULLETS } from 'Constants/connected-apps-config';

type TConnectedAppsInfoBulletsProps = {
    class_name_dynamic_suffix?: string;
    text_color?: string;
    text_size: string;
};

const ConnectedAppsInfoBullets = ({
    class_name_dynamic_suffix,
    text_color,
    text_size,
}: TConnectedAppsInfoBulletsProps) => (
    <ol
        style={{ fontSize: `var(--text-size-${text_size})` }}
        className={classNames(
            'connected-apps__bullets--list',
            class_name_dynamic_suffix ? `connected-apps__bullets--${class_name_dynamic_suffix}` : ''
        )}
    >
        {CONNECTED_APPS_INFO_BULLETS.map(bullet => (
            <li key={bullet.key}>
                <Text as='p' size={text_size} color={text_color}>
                    {bullet.text}
                </Text>
            </li>
        ))}
    </ol>
);

export default ConnectedAppsInfoBullets;
