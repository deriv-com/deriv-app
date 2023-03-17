import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { isMobile } from '@deriv/shared';
import { Button, Icon, StaticUrl, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const Heading = ({ code }) => {
    switch (code) {
        case 'InvalidPhone':
            return (
                <Text as='h1' align='center' weight='bold'>
                    <Localize i18n_default_text='Let’s try that again' />
                </Text>
            );
        case 'DuplicateAccount':
            return (
                <Text as='h1' align='center' weight='bold'>
                    <Localize i18n_default_text='Already signed up?' />
                </Text>
            );
        case 'InvalidAccount':
            return (
                <Text as='h2' size={isMobile() ? 'xs' : 's'} align='center' weight='bold' line_height='xxl'>
                    <Localize i18n_default_text='You can’t add another real account' />
                </Text>
            );
        case 'InputValidationFailed':
            return (
                <Text as='h1' align='center' weight='bold'>
                    <Localize i18n_default_text='Invalid input' />
                </Text>
            );

        default:
            return (
                <Text as='h1' align='center' weight='bold'>
                    <Localize i18n_default_text='Something’s not right' />
                </Text>
            );
    }
};

const Message = ({ code, message, details }) => {
    const invalid_fields_data = Object.keys(details.error_details).map(item => (
        <div key={item} className='invalid_fields_input'>
            <Text size='xs' weight='bold'>
                <Localize i18n_default_text={item} />
            </Text>
            <Text size='xs' weight='bold'>
                :
            </Text>
            <Text size='xs'>{details[item]}</Text>
        </div>
    ));
    switch (code) {
        case 'DuplicateAccount':
            return (
                <p>
                    <Localize i18n_default_text='An account with your details already exists.' />
                    <br />
                    <Localize
                        i18n_default_text="If you're having trouble signing in, let us know via <0>chat</0>"
                        components={[
                            <span className='chat-inline' key={0} onClick={() => window.LC_API.open_chat_window()} />,
                        ]}
                    />
                </p>
            );
        case 'InvalidAccount':
            return (
                <Text size={isMobile() ? 'xxs' : 'xs'} align='center'>
                    <Localize i18n_default_text={message} />
                </Text>
            );
        case 'InputValidationFailed':
            return (
                <div>
                    <Text align='center' weight='normal'>
                        <Localize i18n_default_text='We don’t accept the following input for' />
                    </Text>
                    {invalid_fields_data}
                </div>
            );

        default:
            return <p>{message}</p>;
    }
};

const TryAgain = ({ text, onConfirm }) => (
    <Button primary onClick={onConfirm} large>
        {text}
    </Button>
);

const ErrorCTA = ({ code, onConfirm }) => {
    switch (code) {
        case 'CurrencyTypeNotAllowed':
            return <TryAgain text={localize('Try a different currency')} onConfirm={onConfirm} />;
        case 'InvalidPhone':
            return <TryAgain text={localize('Try a different phone number')} onConfirm={onConfirm} />;
        case 'DuplicateAccount':
            return null;
        case 'InputValidationFailed':
            return <TryAgain text={localize('Let’s try again')} onConfirm={onConfirm} />;
        case 'InvalidAccount':
            return <TryAgain text={localize('OK')} onConfirm={onConfirm} />;

        default:
            return (
                <StaticUrl
                    href={`help-centre/${code === 'InvalidAccount' ? 'account#who-can-open-an-account' : ''}`}
                    type='button'
                    className='dc-btn dc-btn--primary'
                >
                    <Text weight='bold' color='white' size='xxs'>
                        <Localize i18n_default_text='OK' />
                    </Text>
                </StaticUrl>
            );
    }
};

const SignupErrorContent = ({ message, code, onConfirm, className, error_field = {} }) => {
    if (code === 'InputValidationFailed') {
        return (
            <div
                className={classNames('account-wizard--error', {
                    [`account-wizard--error__${className}`]: className,
                })}
            >
                <Icon icon='IcRedWarning' size={64} />
                <Heading code={code} />
                <Message code={code} message={message} details={error_field} />
                <ErrorCTA code={code} onConfirm={onConfirm} />
            </div>
        );
    }
    return (
        <div
            className={classNames('account-wizard--error', {
                [`account-wizard--error__${className}`]: className,
            })}
        >
            <Icon icon='IcAccountError' size={code === 'InvalidAccount' ? 96 : 115} />
            <Heading code={code} />
            <Message code={code} message={message} />
            <ErrorCTA code={code} onConfirm={onConfirm} />
        </div>
    );
};

SignupErrorContent.propTypes = {
    code: PropTypes.string,
    error_field: PropTypes.object,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    className: PropTypes.string,
};

export default SignupErrorContent;
