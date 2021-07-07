import React from 'react';
import PropTypes from 'prop-types';
import { Text, FormSubmitButton, Button, Icon, MultiStep, SendEmailTemplate } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCFDPlatformLabel, CFD_PLATFORMS } from '@deriv/shared';

const ChangePassword = ({ platform, onConfirm }) => (
    <div className='cfd-change-password'>
        <Icon className='cfd-change-password__icon' icon='IcMt5OnePassword' width='122' height='100' />
        <Text as='p' align='center' size='s' weight='bold'>
            <Localize
                i18n_default_text='{{platform}} password'
                values={{
                    platform: getCFDPlatformLabel(platform),
                }}
            />
        </Text>
        <Text as='p' align='center' className='cfd-change-password__description' size='xs'>
            {platform === CFD_PLATFORMS.MT5 ? (
                <Localize i18n_default_text='Use this password to log in to your DMT5 accounts on the desktop, web, and mobile apps.' />
            ) : (
                <Localize i18n_default_text='Use this password to log in to your Deriv X accounts on the web and mobile apps.' />
            )}
        </Text>
        <Button
            className='dc-btn dc-btn--primary dc-btn__large dc-modal__container_cfd-reset-password-modal__button'
            onClick={onConfirm}
        >
            <Text size='xs' weight='bold' color='colored-background'>
                <Localize
                    i18n_default_text='Change {{platform}} password'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                    }}
                />
            </Text>
        </Button>
    </div>
);

ChangePassword.propTypes = {
    onConfirm: PropTypes.func,
    platform: PropTypes.string,
};

const ChangePasswordConfirmation = ({ platform, onConfirm, onCancel }) => (
    <div className='cfd-change-password-confirmation'>
        <Icon className='cfd-change-password__icon' icon='IcMt5OnePassword' width='122' height='100' />
        <Text as='p' align='center' size='s' weight='bold'>
            <Localize
                i18n_default_text='Confirm to change your {{platform}} password'
                values={{
                    platform: getCFDPlatformLabel(platform),
                }}
            />
        </Text>
        <Text
            className='cfd-change-password-confirmation__description'
            as='p'
            align='center'
            color='loss-danger'
            size='xs'
        >
            <Localize
                i18n_default_text='This will change the password to all of your {{platform}} accounts.'
                values={{
                    platform: getCFDPlatformLabel(platform),
                }}
            />
        </Text>
        <FormSubmitButton
            is_center={true}
            label={localize('Confirm')}
            cancel_label={localize('Cancel')}
            has_cancel={true}
            onCancel={onCancel}
            onClick={onConfirm}
        />
    </div>
);

ChangePasswordConfirmation.propTypes = {
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    platform: PropTypes.string,
};

const PasswordReset = ({ onClickSendEmail, platform }) => {
    React.useEffect(() => {
        // TODO: send verify email
    }, []);

    return (
        <SendEmailTemplate
            className='sent-email'
            subtitle={localize('Please click on the link in the email to change your {{platform}} password.', {
                platform: getCFDPlatformLabel(platform),
            })}
            lbl_no_receive={localize("Didn't receive the email?")}
            txt_resend={localize('Resend email')}
            onClickSendEmail={onClickSendEmail}
        />
    );
};

PasswordReset.propTypes = {
    onClickSendEmail: PropTypes.func,
    platform: PropTypes.string,
};

const TradingPasswordManager = ({ platform }) => {
    const multi_step_ref = React.useRef();

    const onClickSendEmail = () => {
        // TODO: send verify email
    };

    const steps = [
        {
            component: <ChangePassword platform={platform} onConfirm={() => multi_step_ref.current?.goNextStep()} />,
        },
        {
            component: (
                <ChangePasswordConfirmation
                    platform={platform}
                    onConfirm={() => multi_step_ref.current?.goNextStep()}
                    onCancel={() => multi_step_ref.current?.goPrevStep()}
                />
            ),
        },
        {
            component: <PasswordReset platform={platform} onClickSendEmail={onClickSendEmail} />,
        },
    ];

    return (
        <React.Fragment>
            <div className='cfd-trading-password'>
                <MultiStep ref={multi_step_ref} steps={steps} />
            </div>
        </React.Fragment>
    );
};

TradingPasswordManager.propTypes = {
    platform: PropTypes.string,
};

export default TradingPasswordManager;
