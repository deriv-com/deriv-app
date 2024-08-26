import './phone-verification.scss';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons';
import { Text, IconButton } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import ConfirmPhoneNumber from './confirm-phone-number';
import OTPVerification from './otp-verification';
import CancelPhoneVerificationModal from './cancel-phone-verification-modal';
import VerificationLinkExpiredModal from './verification-link-expired-modal';
import { observer, useStore } from '@deriv/stores';
import { useGrowthbookGetFeatureValue, useSendOTPVerificationCode } from '@deriv/hooks';
import { Loading } from '@deriv/components';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';

const PhoneVerificationPage = observer(() => {
    const history = useHistory();
    const [otp_verification, setOtpVerification] = useState({
        show_otp_verification: true,
        phone_verification_type: '',
    });
    const [is_loading, setIsLoading] = useState(false);
    const [should_show_verification_link_expired_modal, setShouldShowVerificationLinkExpiredModal] = useState(false);
    const handleBackButton = () => {
        history.push(routes.personal_details);
    };
    const { sendEmailOTPVerification, email_otp_error, is_email_verified } = useSendOTPVerificationCode();
    const [isPhoneNumberVerificationEnabled, isPhoneNumberVerificationGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'phone_number_verification',
    });
    const { isDesktop } = useDevice();
    const { client, ui } = useStore();
    const { is_redirected_from_email, setRedirectFromEmail } = ui;
    const {
        verification_code: { phone_number_verification: phone_number_verification_code },
        is_authorize,
        is_virtual,
        account_settings,
    } = client;

    useEffect(() => {
        if (
            (isPhoneNumberVerificationGBLoaded && !isPhoneNumberVerificationEnabled) ||
            is_virtual ||
            account_settings.phone_number_verification?.verified
        ) {
            history.push(routes.personal_details);
        }
    }, [
        isPhoneNumberVerificationGBLoaded,
        isPhoneNumberVerificationEnabled,
        is_virtual,
        history,
        account_settings.phone_number_verification?.verified,
    ]);

    useEffect(() => {
        if (is_redirected_from_email) {
            setIsLoading(true);
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
                sendEmailOTPVerification(phone_number_verification_code);
            }
        }
    }, [email_otp_error, is_email_verified, phone_number_verification_code, is_authorize, is_redirected_from_email]);

    if (is_loading || !isPhoneNumberVerificationGBLoaded) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div>
            <VerificationLinkExpiredModal
                should_show_verification_link_expired_modal={should_show_verification_link_expired_modal}
                setShouldShowVerificationLinkExpiredModal={setShouldShowVerificationLinkExpiredModal}
            />
            <CancelPhoneVerificationModal />
            {isDesktop && (
                <div className='phone-verification__redirect_button'>
                    <IconButton
                        color='black-white'
                        variant='tertiary'
                        onClick={handleBackButton}
                        icon={
                            <LabelPairedArrowLeftCaptionFillIcon
                                width={24}
                                height={24}
                                data-testid='dt_phone_verification_back_btn'
                                className='phone-verification__redirect_button--icon'
                            />
                        }
                    />
                    <Text className='phone-verification__redirect_button--text' bold>
                        <Localize i18n_default_text='Back to personal details' />
                    </Text>
                </div>
            )}
            {otp_verification.show_otp_verification ? (
                <OTPVerification
                    phone_verification_type={otp_verification.phone_verification_type}
                    setOtpVerification={setOtpVerification}
                />
            ) : (
                <ConfirmPhoneNumber
                    show_confirm_phone_number={!otp_verification.show_otp_verification}
                    setOtpVerification={setOtpVerification}
                />
            )}
        </div>
    );
});

export default PhoneVerificationPage;
