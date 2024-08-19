import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';

type TConnectedAppsRevokeModalProps = {
    handleRevokeAccess: () => void;
    handleToggleModal: (app_id?: number | null) => void;
    is_modal_open: boolean;
};

const ConnectedAppsRevokeModal = ({
    handleRevokeAccess,
    handleToggleModal,
    is_modal_open,
}: TConnectedAppsRevokeModalProps) => (
    <Modal is_open={is_modal_open} className='connected-apps' width='44rem'>
        <Modal.Body>
            <div className='connected-apps-modal--wrapper'>
                <div className='connected-apps-modal--icon'>
                    <Icon icon='IcAccountTrashCan' size={128} />
                    <Text as='p' color='prominent' weight='bold'>
                        <Localize i18n_default_text='Confirm revoke access?' />
                    </Text>
                </div>
                <div className='connected-apps-modal--buttons'>
                    <Button large secondary onClick={() => handleToggleModal()}>
                        <Localize i18n_default_text='Back' />
                    </Button>
                    <Button large primary onClick={handleRevokeAccess}>
                        <Localize i18n_default_text='Confirm' />
                    </Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
);

export default ConnectedAppsRevokeModal;
