import React from 'react';
import { CaptionText } from '@deriv-com/quill-ui';
import { observer, useStore } from '@deriv/stores';
import { LegacyWonIcon } from '@deriv/quill-icons';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';
import { Popover, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';
import classNames from 'classnames';

export const VerifyButton = observer(() => {
    const [open_popover, setOpenPopover] = React.useState(false);
    const { client, ui } = useStore();
    const { is_mobile } = ui;
    const { account_settings } = client;
    const { phone_number_verification } = account_settings;
    const phone_number_verified = phone_number_verification?.verified;
    const history = useHistory();
    //@ts-expect-error remove this comment when types are added in GetSettings api types
    const { send } = useVerifyEmail('phone_number_verification');
    const { next_otp_request } = usePhoneNumberVerificationSetTimer();

    const redirectToPhoneVerification = () => {
        if (next_otp_request) return;
        send();
        history.push(routes.phone_verification);
    };

    return (
        <div className='account-form__phone-verification-btn'>
            {phone_number_verified ? (
                <div className='account-form__phone-verification-btn--verified'>
                    <LegacyWonIcon iconSize='xs' />
                    <CaptionText bold color='#4bb4b3'>
                        <Localize i18n_default_text='Verified' />
                    </CaptionText>
                    <Popover
                        data_testid='dt_phone_verification_popover'
                        alignment={is_mobile ? 'top' : 'right'}
                        className='phone-verification__popover'
                        icon='info'
                        is_open={open_popover}
                        disable_message_icon
                        onClick={() => setOpenPopover(prev => !prev)}
                        message={
                            <Text size='xxs'>
                                <Localize
                                    i18n_default_text='To change your verified phone number, contact us via <0>live chat</0>.'
                                    components={[
                                        <a
                                            key={0}
                                            className='link link--orange'
                                            onClick={() => window.LC_API.open_chat_window()}
                                        />,
                                    ]}
                                />
                            </Text>
                        }
                        zIndex='9999'
                    />
                </div>
            ) : (
                <Text
                    size='xxs'
                    weight='bold'
                    color='red'
                    className={classNames('account-form__phone-verification-btn--not-verified', {
                        'account-form__phone-verification-btn--not-verified--disabled': !!next_otp_request,
                    })}
                    disabled={true}
                    onClick={redirectToPhoneVerification}
                >
                    <Localize
                        i18n_default_text='Verify {{next_email_attempt_timestamp}}'
                        values={{ next_email_attempt_timestamp: next_otp_request }}
                    />
                </Text>
            )}
        </div>
    );
});
