import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { CaptionText } from '@deriv-com/quill-ui';
import { observer, useStore } from '@deriv/stores';
import { LegacyWonIcon } from '@deriv/quill-icons';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';
import { OpenLiveChatLink, Popover, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';
import { useDevice } from '@deriv-com/ui';
import './verify-button.scss';

type TVerifyButton = {
    is_disabled: boolean;
};

export const VerifyButton = observer(({ is_disabled }: TVerifyButton) => {
    const [open_popover, setOpenPopover] = useState(false);
    const { client, ui } = useStore();
    const { setShouldShowPhoneNumberOTP } = ui;
    const { account_settings, setVerificationCode } = client;
    const { phone_number_verification } = account_settings;
    const phone_number_verified = phone_number_verification?.verified;
    const history = useHistory();
    //@ts-expect-error remove this comment when types are added in GetSettings api types
    const { sendPhoneNumberVerifyEmail, WS } = useVerifyEmail('phone_number_verification');
    const { isMobile } = useDevice();
    const { next_otp_request } = usePhoneNumberVerificationSetTimer();

    useEffect(() => {
        if (WS.isSuccess) {
            history.push(routes.phone_verification);
        }
    }, [WS.isSuccess, history]);

    const redirectToPhoneVerification = () => {
        if (next_otp_request || is_disabled) return;
        setVerificationCode('', 'phone_number_verification');
        setShouldShowPhoneNumberOTP(false);
        sendPhoneNumberVerifyEmail();
    };

    return (
        <div className='phone-verification-btn'>
            {phone_number_verified ? (
                <div className='phone-verification-btn--verified'>
                    <LegacyWonIcon iconSize='xs' />
                    <CaptionText bold color='#4bb4b3'>
                        <Localize i18n_default_text='Verified' />
                    </CaptionText>
                    <Popover
                        data_testid='dt_phone_verification_popover'
                        alignment={isMobile ? 'top' : 'right'}
                        className='phone-verification__popover'
                        icon='info'
                        is_open={open_popover}
                        disable_message_icon
                        onClick={() => setOpenPopover(prev => !prev)}
                        message={
                            <Text size='xxs'>
                                <Localize
                                    i18n_default_text='To change your verified phone number, contact us via <0></0>.'
                                    components={[<OpenLiveChatLink text_size='xxs' key={0} />]}
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
                    className={clsx('phone-verification-btn--not-verified', {
                        'phone-verification-btn--not-verified--disabled': !!next_otp_request || is_disabled,
                    })}
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
