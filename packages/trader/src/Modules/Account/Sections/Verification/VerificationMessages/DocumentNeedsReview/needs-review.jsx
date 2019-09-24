import React              from 'react';
import ButtonLink         from 'App/Components/Routes/button-link.jsx';
import { localize }       from 'App/i18n';
import IconChecked        from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-checked.svg';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const message = (
    <div className='account-management__message-content' style={{ margin: 'unset' }}>
        <h1 className='account-management__message-title'>
            {localize('Your proof of address was submitted successfully')}
        </h1>
        <p className='account-management__message-subtitle'>
            {localize('Your document is being reviewed, please check back in 1-3 days.')}
        </p>
        <ButtonLink
            to='/'
            className='btn--primary--default'
        >
            <span className='btn__text'>
                {localize('Continue trading')}
            </span>
        </ButtonLink>
    </div>
);

const NeedsReviewMessage = () => (
    <IconMessageContent
        message={message}
        icon={<IconChecked />}
    />
);

export default NeedsReviewMessage;
