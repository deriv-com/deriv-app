import React              from 'react';
import ButtonLink         from 'App/Components/Routes/button-link.jsx';
import IconSubmitted      from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-submitted.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const Message = ({ needs_poi }) => (
    <div className='account-management__message-content' style={{ margin: 'unset' }}>
        <h1 className='account-management__message-title'>
            {localize('Your proof of address was submitted successfully')}
        </h1>
        <p className='account-management__message-subtitle'>
            {localize('Your document is being reviewed, please check back in 1-3 days.')}
        </p>
        {needs_poi ?
            <>
                <p className='account-management__message-subtitle'>
                    {localize('You must also submit a proof of identity.')}
                </p>
                <ButtonLink
                    to='/account/proof-of-identity'
                    className='btn--primary--default'
                >
                    <span className='btn__text'>
                        {localize('Submit proof of identity')}
                    </span>
                </ButtonLink>
            </>
            :
            <ButtonLink
                to='/'
                className='btn--primary--default'
            >
                <span className='btn__text'>
                    {localize('Continue trading')}
                </span>
            </ButtonLink>
        }
    </div>
);

const SubmittedMessage = ({ needs_poi }) => (
    <IconMessageContent
        message={<Message needs_poi={needs_poi} /> }
        icon={<IconSubmitted />}
    />
);

export default SubmittedMessage;
