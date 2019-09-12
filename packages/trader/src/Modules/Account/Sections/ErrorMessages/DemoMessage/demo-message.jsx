import React              from 'react';
import { Button }         from 'deriv-components';
import IconLimitedAccess  from 'Assets/AccountManagement/icon-limited-access.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../Components/icon-message-content.jsx';

const DemoMessage = () => (
    <IconMessageContent
        message={localize('This feature is not available for demo accounts.')}
        icon={<IconLimitedAccess />}
    />
);

export default DemoMessage;
