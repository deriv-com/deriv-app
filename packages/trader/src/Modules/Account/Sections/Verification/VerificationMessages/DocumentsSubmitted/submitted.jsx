import React              from 'react';
import IconSubmitted      from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-submitted.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const SubmittedMessage = () => (
    <IconMessageContent
        message={localize('This feature is not available for demo accounts.')}
        icon={<IconSubmitted />}
    />
);

export default SubmittedMessage;
