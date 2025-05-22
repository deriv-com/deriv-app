import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router';

type TCoolDownPeriodModal = {
    show_cool_down_period_modal: boolean;
    setShowCoolDownPeriodModal: (value: boolean) => void;
};

const CoolDownPeriodModal = observer(
    ({ show_cool_down_period_modal, setShowCoolDownPeriodModal }: TCoolDownPeriodModal) => {
        const { ui } = useStore();
        const history = useHistory();
        const previous_route = localStorage.getItem('routes_from_notification_to_pnv');
        const should_route_back_to_previous =
            previous_route !== routes.personal_details &&
            previous_route !== routes.phone_verification &&
            !!previous_route;

        const { isMobile } = useDevice();
        const { setIsForcedToExitPnv, setShouldShowPhoneNumberOTP } = ui;
        const handleCloseCoolDownPeriodModal = () => {
            setShouldShowPhoneNumberOTP(false);
            setIsForcedToExitPnv(false);
            setShowCoolDownPeriodModal(false);
            localStorage.removeItem('routes_from_notification_to_pnv');

            should_route_back_to_previous ? history.push(previous_route) : history.push(routes.traders_hub);
        };
        return (
            <Modal
                isOpened={show_cool_down_period_modal}
                isMobile={isMobile}
                showCrossIcon={false}
                showHandleBar={false}
                isNonExpandable
                primaryButtonLabel={<Localize i18n_default_text='OK' />}
                primaryButtonCallback={handleCloseCoolDownPeriodModal}
                disableCloseOnOverlay
                buttonColor='coral'
            >
                <Modal.Header title={<Localize i18n_default_text='OTP limit reached' />} />
                <Modal.Body>
                    <Text>
                        <Localize i18n_default_text='Request a new OTP after 10 minutes.' />
                    </Text>
                </Modal.Body>
            </Modal>
        );
    }
);

export default CoolDownPeriodModal;
