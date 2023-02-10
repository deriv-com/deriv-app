import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize, Localize } from '@deriv/translations';
import { Text, Dialog } from '@deriv/components';
import { isMobile, getAuthenticationStatusInfo } from '@deriv/shared';

type TFailedVerificationModal = {
    should_resubmit_poi: boolean;
    should_resubmit_poa: boolean;
    from_account: string;
};

const FailedVerificationModalContent = ({
    should_resubmit_poi,
    should_resubmit_poa,
    from_account,
}: TFailedVerificationModal) => {
    return (
        <React.Fragment>
            <Text size={isMobile() ? 'xxs' : 'xs'}>
                {localize('The following documents you submitted did not pass our checks:')}
            </Text>
            <div className='failed-verification-modal__failed_list'>
                {should_resubmit_poi && (
                    <Text
                        size={isMobile() ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of identity' />
                    </Text>
                )}
                {should_resubmit_poa && (
                    <Text
                        size={isMobile() ? 'xxs' : 'xs'}
                        line_height='xl'
                        className='failed-verification-modal__failed_list-item'
                    >
                        <Localize i18n_default_text='Proof of address.' />
                    </Text>
                )}
            </div>
            <Text size={isMobile() ? 'xxs' : 'xs'}>
                {localize(`If you’d like to get the ${from_account} account, resubmit these documents.`)}
            </Text>
        </React.Fragment>
    );
};

const FailedVerificationModal = () => {
    const {
        traders_hub,
        ui,
        modules: { cfd },
        client,
    } = useStores();
    const {
        is_failed_verification_modal_visible,
        toggleFailedVerificationModalVisibility,
        open_failed_verification_for,
    } = traders_hub;
    const { account_status } = client;
    const { toggleCFDVerificationModal } = cfd;
    const { disableApp, enableApp } = ui;
    const is_from_multipliers = open_failed_verification_for === 'multipiliers';
    const { poi_resubmit_for_vanuatu_maltainvest, poi_resubmit_for_bvi_labuan, need_poa_resubmission } =
        getAuthenticationStatusInfo(account_status);

    const closeModal = () => {
        toggleFailedVerificationModalVisibility();
    };

    const onConfirmModal = () => {
        toggleFailedVerificationModalVisibility();
        toggleCFDVerificationModal();
    };

    const should_resubmit_poi = () => {
        if (
            is_from_multipliers ||
            open_failed_verification_for === 'vanuatu' ||
            open_failed_verification_for === 'maltainvest'
        ) {
            return poi_resubmit_for_vanuatu_maltainvest;
        }
        return poi_resubmit_for_bvi_labuan;
    };
    const should_resubmit_poa = need_poa_resubmission;
    const from_account_label = is_from_multipliers ? localize('Multipliers') : localize('MT5 CFDs');

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
                should_resubmit_poi={should_resubmit_poi()}
                should_resubmit_poa={should_resubmit_poa}
                from_account={from_account_label}
            />
        </Dialog>
    );
};

export default observer(FailedVerificationModal);
