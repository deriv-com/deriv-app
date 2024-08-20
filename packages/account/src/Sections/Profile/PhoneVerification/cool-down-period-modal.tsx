import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
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
        const { setIsForcedToExitPnv } = ui;
        const handleCloseCoolDownPeriodModal = () => {
            setIsForcedToExitPnv(false);
            setShowCoolDownPeriodModal(false);
            history.push(routes.personal_details);
        };
        return (
            <Modal
                isOpened={show_cool_down_period_modal}
                primaryButtonLabel={<Localize i18n_default_text='Ok' />}
                primaryButtonCallback={handleCloseCoolDownPeriodModal}
            >
                <Modal.Header title={<Localize i18n_default_text='Cool down period' />} />
                <Modal.Body>
                    <Text>
                        <Localize i18n_default_text='Maximum OTP limit reached. Request a new OTP after 10 minutes.' />
                    </Text>
                </Modal.Body>
            </Modal>
        );
    }
);

export default CoolDownPeriodModal;
