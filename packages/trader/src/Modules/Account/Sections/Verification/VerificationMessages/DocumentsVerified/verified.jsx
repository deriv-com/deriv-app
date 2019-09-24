import React              from 'react';
import ButtonLink         from 'App/Components/Routes/button-link.jsx';
import IconVerified      from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-verified.svg';
import { localize }       from 'App/i18n';
import IconMessageContent from '../../../../Components/icon-message-content.jsx';

const Message = ({ needs_poi }) => (
    <div className='account-management__message-content' style={{ margin: 'unset' }}>
        <h1 className='account-management__message-title'>
            {localize('Your proof of address is verified')}
        </h1>
        {needs_poi ?
            <>
                <p className='account-management__message-subtitle'>
                    {localize('To continue trading, you must also submit a proof of identity.')}
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

const VerifiedMessage = ({ needs_poi }) => (
    <IconMessageContent
        message={<Message needs_poi={needs_poi} /> }
        icon={<IconVerified />}
    />
);

export default VerifiedMessage;
