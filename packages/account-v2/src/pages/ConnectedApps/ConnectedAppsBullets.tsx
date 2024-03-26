import React, { ComponentProps } from 'react';
import { Text } from '@deriv-com/ui';
import { CONNECTED_APPS_INFO_BULLETS } from '../../constants/connectedAppsConstants';

type TConnectedAppsBullets = {
    color?: ComponentProps<typeof Text>['color'];
    style: string;
};

export const ConnectedAppsBullets = ({ color, style }: TConnectedAppsBullets) => (
    <Text as='ol' className={style} color={color} size='sm'>
        {CONNECTED_APPS_INFO_BULLETS.map((bullet, i) => (
            <li key={i}>{bullet}</li>
        ))}
    </Text>
);
