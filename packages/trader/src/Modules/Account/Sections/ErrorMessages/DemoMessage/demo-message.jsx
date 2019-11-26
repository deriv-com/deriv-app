import React              from 'react';
import IconLimitedAccess  from 'Assets/AccountManagement/icon-limited-access.svg';
import { localize }       from 'deriv-translations';
import IconMessageContent from '../../../Components/icon-message-content.jsx';

const DemoMessage = () => (
    <IconMessageContent
        message={localize('This feature is not available for demo accounts.')}
        icon={<IconLimitedAccess />}
    />
);

export default DemoMessage;
