import React              from 'react';
import { Button }         from 'deriv-components';
import ButtonLink         from 'App/Components/Routes/button-link.jsx';
import { localize }       from 'App/i18n';
import Localize           from 'App/Components/Elements/localize.jsx';
import IconChecked        from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-checked.svg';
import IconExpired        from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-expired.svg';
import IconSubmitted      from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-submitted.svg';
import IconVerified       from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-verified.svg';
import IconFailed         from 'Assets/AccountManagement/ProofOfAddress/Messages/icon-failed.svg';
import IconMessageContent from '../../../Components/icon-message-content.jsx';

const MessageContent = ({ children, title, subtitle }) => (
    <div className='account-management__message-content' style={{ margin: 'unset' }}>
        <h1 className='account-management__message-title'>
            {title}
        </h1>
        <p className='account-management__message-subtitle'>
            {subtitle}
        </p>
        {children}
    </div>
);

export const Expired = ({ onClick }) => {
    const message = (
        <MessageContent
            title={localize('New proof of address is needed')}
            subtitle={localize('Your documents for proof of address is expired. Please submit again.')}
        >
            <Button
                onClick={onClick}
                className='btn--primary--default'
                has_effect
            >
                <span className='btn__text'>
                    {localize('Resubmit')}
                </span>
            </Button>
        </MessageContent>
    );

    return (
        <IconMessageContent
            message={message}
            icon={<IconExpired />}
        />
    );
};

export const NeedsReview = () => {
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

    return (
        <IconMessageContent
            message={message}
            icon={<IconSubmitted />}
        />
    );
};

export const Submitted = ({ needs_poi }) => {
    const message = (
        <MessageContent
            title={localize('Your proof of address was submitted successfully')}
            subtitle={localize('Your document is being reviewed, please check back in 1-3 days.')}
        >
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
        </MessageContent>
    );

    return (
        <IconMessageContent
            message={message}
            icon={<IconChecked />}
        />
    );
};

export const Verified = ({ needs_poi }) => {
    const message = (
        <MessageContent
            title={localize('Your proof of address is verified')}
            subtitle={needs_poi ? localize('To continue trading, you must also submit a proof of identity.') : undefined}
        >
            {needs_poi ?
                <ButtonLink
                    to='/account/proof-of-identity'
                    className='btn--primary--default'
                >
                    <span className='btn__text'>
                        {localize('Submit proof of identity')}
                    </span>
                </ButtonLink>
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
        </MessageContent>
    );

    return (
        <IconMessageContent
            message={message}
            icon={<IconVerified />}
        />
    );
};

export const Unverified = () =>  (
    <IconMessageContent
        message={localize('We could not verify your proof of identity')}
        text={
            <Localize
                i18n_default_text='As a precaution, we have disabled trading, deposits and withdrawals for this account. If you have any questions, please go to our <0>Help Centre</0>.'
                components={[
                    <a key={0} className='link link--orange' rel='noopener noreferrer' target='_blank' href='mailto:support@deriv.com' />,
                ]}
            />}
        icon={<IconFailed />}
    />
);
