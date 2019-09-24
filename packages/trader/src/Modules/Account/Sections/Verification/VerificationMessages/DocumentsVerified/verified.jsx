import React              from 'react';
import IconVerified       from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-verified.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const VerifiedMessage = ({ has_poi_requirement }) =>  (
    has_poi_requirement ?
        <IconMessageContent
            message={localize('Your proof of identity is verified')}
            icon={<IconVerified />}
        />
        :
        <IconMessageContent
            message={localize('To continue trading, you must also submit a proof of identity.')}
            icon={<IconVerified />}
        />
);

export default VerifiedMessage;
