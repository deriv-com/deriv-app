import React from 'react';
import { localize } from '@deriv/translations';
import IconWithMessage from 'Components/icon-with-message';

type TDemoMessage = {
    has_demo_icon?: boolean;
    has_button?: boolean;
};

const DemoMessage = ({ has_demo_icon, has_button }: TDemoMessage) => (
    <IconWithMessage
        icon={has_demo_icon ? 'IcPoaLockDemo' : 'IcPoaLock'}
        message={localize('This feature is not available for demo accounts.')}
        has_button={has_button}
    />
);

export default DemoMessage;
