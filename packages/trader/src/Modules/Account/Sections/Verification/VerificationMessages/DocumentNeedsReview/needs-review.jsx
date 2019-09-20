import React              from 'react';
import IconFailed         from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-failed.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const NeedsReviewMessage = () => (
    <IconMessageContent
        message={localize('This feature is not available for demo accounts.')}
        icon={<IconFailed />}
    />
);

export default NeedsReviewMessage;
