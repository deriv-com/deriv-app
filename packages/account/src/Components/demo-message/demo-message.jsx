import React from 'react';
import { localize } from '@deriv/translations';
import IconWithMessage from 'Components/icon-with-message';

const DemoMessage = () => (
    <IconWithMessage icon='IcPoaLock' message={localize('This feature is not available for demo accounts.')} />
);

export default DemoMessage;
