import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import { Text, Dialog } from '@deriv/components';
import { getAuthenticationStatusInfo, routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import './verification-docs-list-modal.scss';

type TFailedVerificationModalProps = {
    identity: string;
    address: string;
    tax: string;
};

const VerificationDocsListModalContent = ({ identity, address, tax }: TFailedVerificationModalProps) => {
    const { isMobile } = useDevice();
    return (
        <React.Fragment>
            <Text size={isMobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text='The following documents you submitted did not pass our checks:' />
            </Text>
            <div className='failed-verification-modal__failed_list'>
                {identity && (
                    <Text
                        size={isMobile ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of identity' />
                    </Text>
                )}
                {address && (
                    <Text
                        size={isMobile ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of address.' />
                    </Text>
                )}
                {tax && (
                    <Text
                        size={isMobile ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Tax residence.' />
                    </Text>
                )}
            </div>
            <Text size={isMobile ? 'xxs' : 'xs'}>
                <Localize i18n_default_text='If you’d like to get the Multipliers account, resubmit these documents.' />
            </Text>
        </React.Fragment>
    );
};

const VerificationDocsListModal = observer(({ identity, address, tax }: TFailedVerificationModalProps) => {
    const { traders_hub, ui, client } = useStore();
    const { is_verification_docs_list_modal_visible, toggleVerificationModal } = traders_hub;
    const { account_status } = client;
    const { disableApp, enableApp } = ui;

    const { need_poi_submission, need_poa_submission } = useGetMFAccountStatus();
    const history = useHistory();

    const closeModal = () => {
        toggleVerificationModal();
    };

    const onConfirmModal = () => {
        toggleVerificationModal();
        if (identity) {
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
            is_visible={is_verification_docs_list_modal_visible}
            onCancel={closeModal}
            onConfirm={onConfirmModal}
            className='failed-verification-modal'
        >
            <VerificationDocsListModalContent identity={identity} address={address} tax={tax} />
        </Dialog>
    );
});

export default observer(VerificationDocsListModal);
