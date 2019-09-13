import React              from 'react';
import { localize }       from 'App/i18n';
import IconLimitedAccess  from 'Assets/AccountManagement/icon-limited-access.svg';
import IconMessageContent from '../../../Components/icon-message-content.jsx';

// TODO: Needs UI
const LoadErrorMessage = ({ error_message }) => (
    <IconMessageContent
        message={error_message || localize('Something went wrong')}
        icon={<IconLimitedAccess />}
    />
);

export default LoadErrorMessage;
