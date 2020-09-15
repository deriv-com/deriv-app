import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon } from '@deriv/components';
import { getStaticUrl, PlatformContext } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const SignupErrorContent = ({ message, code, onConfirm }) => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const Heading = () => {
        switch (code) {
            case 'InvalidPhone':
                return (
                    <h1>
                        <Localize i18n_default_text='Let’s try that again' />
                    </h1>
                );
            case 'DuplicateAccount':
                return (
                    <h1>
                        <Localize i18n_default_text='Already signed up?' />
                    </h1>
                );
            default:
                return (
                    <h1>
                        <Localize i18n_default_text='Something’s not right' />
                    </h1>
                );
        }
    };

    const Message = () => {
        switch (code) {
            case 'DuplicateAccount':
                return (
                    <p>
                        <Localize i18n_default_text='An account with your details already exists.' />
                        <br />
                        <Localize
                            i18n_default_text="If you're having trouble signing in, let us know via <0>chat</0>"
                            components={[
                                <span
                                    className='chat-inline'
                                    key={0}
                                    onClick={() => window.LC_API.open_chat_window()}
                                />,
                            ]}
                        />
                    </p>
                );
            default:
                return <p>{message}</p>;
        }
    };

    const TryAgain = ({ text }) => (
        <Button primary onClick={onConfirm} large>
            {text}
        </Button>
    );

    const ErrorCTA = () => {
        switch (code) {
            case 'CurrencyTypeNotAllowed':
                return <TryAgain text={localize('Try a different currency')} />;
            case 'InvalidPhone':
                return <TryAgain text={localize('Try a different phone number')} />;
            case 'DuplicateAccount':
                return null;
            default:
                return (
                    <a
                        href={getStaticUrl('help-centre', { is_deriv_crypto })}
                        type='button'
                        className='dc-btn dc-btn--primary'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <span className='dc-btn__text'>
                            <Localize i18n_default_text='OK' />
                        </span>
                    </a>
                );
        }
    };

    return (
        <div className='account-wizard--error'>
            <Icon icon='IcAccountError' size={115} />
            <Heading />
            <Message />
            <ErrorCTA />
        </div>
    );
};

SignupErrorContent.propTypes = {
    code: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
};

export default SignupErrorContent;
