import React              from 'react';
import { Button }         from 'deriv-components';
import IconChecked        from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-checked.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const message = (
    <div className='account-management__message-content' style={{ margin: 'unset' }}>
        <h1 className='account-management__message-title'>
            {localize('Your proof of address was submitted successfully')}
        </h1>
        <p className='account-management__message-subtitle'>
            {localize('Your document is being reviewed, please check back in 1-3 days.')}
        </p>
        {/* TODO: Make button link to trading */}
        <Button className='btn--primary' has_effect text={localize('Continue trading')} />
    </div>
);

const NeedsReviewMessage = () => (
    <IconMessageContent
        message={message}
        icon={<IconChecked />}
    />
);

export default NeedsReviewMessage;
