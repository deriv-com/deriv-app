import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useGrowthbookGetFeatureValue, usePhoneVerificationAnalytics } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

type TPhoneNumberVerifiedModal = {
    should_show_phone_number_verified_modal: boolean;
};

const PhoneNumberVerifiedModal = observer(({ should_show_phone_number_verified_modal }: TPhoneNumberVerifiedModal) => {
    const history = useHistory();
    const previous_route = localStorage.getItem('routes_from_notification_to_pnv');
    const should_route_back_to_previous =
        previous_route !== routes.personal_details && previous_route !== routes.phone_verification && !!previous_route;

    const handleDoneButton = () => {
        localStorage.removeItem('routes_from_notification_to_pnv');

        should_route_back_to_previous ? history.push(previous_route) : history.push(routes.traders_hub);
    };
    const [isCountryCodeDropdownEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_country_code_dropdown',
    });

    const { isMobile } = useDevice();
    const {
        ui,
        client: { account_settings },
    } = useStore();
    const { setIsPhoneVerificationCompleted, setShouldShowPhoneNumberOTP } = ui;
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();

    useEffect(() => {
        if (should_show_phone_number_verified_modal) {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verification_successful',
            });
            setShouldShowPhoneNumberOTP(false);
            setIsPhoneVerificationCompleted(true);
        }
    }, [should_show_phone_number_verified_modal, trackPhoneVerificationEvents]);

    return (
        <Modal
            isMobile={isMobile}
            isOpened={should_show_phone_number_verified_modal}
            showHandleBar={false}
            showCrossIcon={false}
            isNonExpandable
            buttonColor='coral'
            primaryButtonCallback={handleDoneButton}
            primaryButtonLabel={<Localize i18n_default_text='OK' />}
            disableCloseOnOverlay
        >
            <Modal.Header title={<Localize i18n_default_text='Phone number verified' />} />
            <Modal.Body>
                <div className='phone-verification__verified-modal--contents'>
                    <div className='phone-verification__verified-modal--contents__phone-number-container'>
                        <div className='phone-verification__verified-modal--contents__phone-number-container__phone-number'>
                            {isCountryCodeDropdownEnabled
                                ? //@ts-expect-error account_settings.calling_country_code is not defined in GetSettings type
                                  `+${account_settings?.calling_country_code}${account_settings?.phone}`
                                : `${account_settings?.phone}`}
                        </div>
                        &nbsp;
                        <Text>
                            <Localize i18n_default_text=' is verified as your phone number.' />
                        </Text>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default PhoneNumberVerifiedModal;
