import React              from 'react';
import IconExpired        from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-expired.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const message = (
    <>
        <h1>{localize('New proof of address is needed')}</h1>
        <p>{localize('Your documents for proof of address is expired. Please submit again.')}</p>
    </>
);

const ExpiredMessage = () => (
    <IconMessageContent
        message={message}
        icon={<IconExpired />}
    />
);

export default ExpiredMessage;
