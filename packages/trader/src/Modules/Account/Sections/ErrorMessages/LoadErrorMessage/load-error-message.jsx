import React              from 'react';
import IconLimitedAccess  from 'Assets/AccountManagement/icon-limited-access.svg';
import IconMessageContent from '../../../Components/icon-message-content.jsx';

// TODO: Needs UI
const LoadErrorMessage = ({ error_message }) => (
    <IconMessageContent
        message={error_message}
        icon={<IconLimitedAccess />}
    />
);

export default LoadErrorMessage;
