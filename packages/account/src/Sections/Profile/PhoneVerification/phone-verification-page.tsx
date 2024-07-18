import './phone-verification.scss';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import ConfirmPhoneNumber from './confirm-phone-number';
import OTPVerification from './otp-verification';
import CancelPhoneVerificationModal from './cancel-phone-verification-modal';
import VerificationLinkExpiredModal from './verification-link-expired-modal';
import { observer, useStore } from '@deriv/stores';
import { useSendOTPVerificationCode } from '@deriv/hooks';
import { Loading } from '@deriv/components';
import { useEffect, useState } from 'react';

const PhoneVerificationPage = observer(() => {
    const [otp_verification, setOtpVerification] = useState({
        show_otp_verification: true,
        phone_verification_type: '',
    });
    const [is_loading, setIsLoading] = useState(false);
    const [should_show_cancel_verification_modal, setShouldShowCancelVerificationModal] = useState(false);
    const [should_show_verification_link_expired_modal, setShouldShowVerificationLinkExpiredModal] = useState(false);
    const handleBackButton = () => {
        setShouldShowCancelVerificationModal(true);
    };
    const { sendEmailOTPVerification, email_otp_error, is_email_verified } = useSendOTPVerificationCode();

    const { client, ui } = useStore();
    const { is_redirected_from_email, setRedirectFromEmail } = ui;
    const {
        verification_code: { phone_number_verification: phone_number_verification_code },
        is_authorize,
    } = client;

    useEffect(() => {
        if (is_redirected_from_email) {
            if (email_otp_error) {
                setIsLoading(false);
                setShouldShowVerificationLinkExpiredModal(true);
                setRedirectFromEmail(false);
            } else if (is_email_verified) {
                setIsLoading(false);
                setOtpVerification({
                    show_otp_verification: false,
                    phone_verification_type: '',
                });
                setRedirectFromEmail(false);
            } else if (phone_number_verification_code && is_authorize) {
                setIsLoading(true);
                sendEmailOTPVerification(phone_number_verification_code);
            }
        }
    }, [email_otp_error, is_email_verified, phone_number_verification_code, is_authorize]);

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div>
            <VerificationLinkExpiredModal
                should_show_verification_link_expired_modal={should_show_verification_link_expired_modal}
                setShouldShowVerificationLinkExpiredModal={setShouldShowVerificationLinkExpiredModal}
            />
            <CancelPhoneVerificationModal
                should_show_cancel_verification_modal={should_show_cancel_verification_modal}
                setShouldShowCancelVerificationModal={setShouldShowCancelVerificationModal}
            />
            <div className='phone-verification__redirect_button'>
                <LabelPairedArrowLeftCaptionFillIcon
                    width={24}
                    height={24}
                    data-testid='dt_phone_verification_back_btn'
                    className='phone-verification__redirect_button--icon'
                    onClick={handleBackButton}
                />
                <Text className='phone-verification__redirect_button--text' bold>
                    <Localize i18n_default_text='Phone number verification' />
                </Text>
            </div>
            {otp_verification.show_otp_verification ? (
                <OTPVerification
                    phone_verification_type={otp_verification.phone_verification_type}
                    setOtpVerification={setOtpVerification}
                />
            ) : (
                <ConfirmPhoneNumber setOtpVerification={setOtpVerification} />
            )}
        </div>
    );
});

export default PhoneVerificationPage;
