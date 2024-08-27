import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import { Text, Dialog } from '@deriv/components';
import { getAuthenticationStatusInfo, routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import './failed-verification-modal.scss';

type TFailedVerificationModal = {
    should_resubmit_poi: boolean;
    should_resubmit_poa: boolean;
};

const FailedVerificationModalContent = ({ should_resubmit_poi, should_resubmit_poa }: TFailedVerificationModal) => {
    const { isMobile } = useDevice();
    return (
        <React.Fragment>
            <Text size={isMobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text='The following documents you submitted did not pass our checks:' />
            </Text>
            <div className='failed-verification-modal__failed_list'>
                {should_resubmit_poi && (
                    <Text
                        size={isMobile ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of identity' />
                    </Text>
                )}
                {should_resubmit_poa && (
                    <Text
                        size={isMobile ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of address.' />
                    </Text>
                )}
            </div>
            <Text size={isMobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text='If you’d like to get the Multipliers account, resubmit these documents.' />
            </Text>
        </React.Fragment>
    );
};

const FailedVerificationModal = observer(() => {
    const { traders_hub, ui, client } = useStore();
    const { is_failed_verification_modal_visible, toggleFailedVerificationModalVisibility } = traders_hub;
    const { account_status } = client;
    const { disableApp, enableApp } = ui;

    const { poi_resubmit_for_maltainvest: should_resubmit_poi, need_poa_resubmission: should_resubmit_poa } =
        getAuthenticationStatusInfo(account_status);
    const history = useHistory();

    const closeModal = () => {
        toggleFailedVerificationModalVisibility();
    };

    const onConfirmModal = () => {
        toggleFailedVerificationModalVisibility();
        if (should_resubmit_poi) {
            history.push(routes.proof_of_identity);
        } else {
            history.push(routes.proof_of_address);
        }
    };

    return (
        <Dialog
            title={localize('Why did my verification fail?')}
            confirm_button_text={localize('Resubmit documents')}
            cancel_button_text={localize('Maybe later')}
            is_closed_on_cancel
            disableApp={disableApp}
            enableApp={enableApp}
            is_closed_on_confirm
            is_visible={is_failed_verification_modal_visible}
            onCancel={closeModal}
            onConfirm={onConfirmModal}
            className='failed-verification-modal'
        >
            <FailedVerificationModalContent
                should_resubmit_poi={should_resubmit_poi}
                should_resubmit_poa={should_resubmit_poa}
            />
        </Dialog>
    );
});

export default observer(FailedVerificationModal);
