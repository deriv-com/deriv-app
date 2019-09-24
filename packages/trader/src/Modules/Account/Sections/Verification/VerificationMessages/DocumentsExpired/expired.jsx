import React              from 'react';
import { Button }         from 'deriv-components';
import IconExpired        from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-expired.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const Message = ({ onClick }) => (
    <div className='account-management__message-content' style={{ margin: 'unset' }}>
        <h1 className='account-management__message-title'>
            {localize('New proof of address is needed')}
        </h1>
        <p className='account-management__message-subtitle'>
            {localize('Your documents for proof of address is expired. Please submit again.')}
        </p>
        <Button
            onClick={onClick}
            className='btn--primary--default'
            has_effect
        >
            <span className='btn__text'>
                {localize('Resubmit')}
            </span>
        </Button>
    </div>
);

const ExpiredMessage = ({ onClick }) => (
    <IconMessageContent
        message={<Message onClick={onClick} />}
        icon={<IconExpired />}
    />
);

export default ExpiredMessage;
