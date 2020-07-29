import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon } from '@deriv/components';
import { getDerivComLink } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const SignupErrorContent = ({ message, code, onConfirm }) => {
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
                        <Localize
                            i18n_default_text='An account with your details already exists. If you are having problems signing into your account please email <0>support@deriv.com</0>'
                            components={[
                                <a
                                    className='email-inline'
                                    key={0}
                                    href='mailto:support@deriv.com'
                                    target='_blank'
                                    rel='noreferrer nofollow'
                                />,
                            ]}
                        />
                    </p>
                );
            default:
                return <p>{message}</p>;
        }
    };

    const ErrorCTA = () => {
        switch (code) {
            case 'InvalidPhone':
                return (
                    <Button primary onClick={onConfirm} large>
                        <Localize i18n_default_text='Try again using a different phone number' />
                    </Button>
                );
            case 'DuplicateAccount':
                return null;
            default:
                return (
                    <a
                        href={getDerivComLink('help-centre')}
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
