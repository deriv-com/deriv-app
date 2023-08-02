import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getMT5Title, CFD_PLATFORMS } from '@deriv/shared';
import { TJurisdictionModalProps } from '../props.types';
import { observer, useStore } from '@deriv/stores';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import JurisdictionModalContentWrapper from './jurisdiction-modal-content-wrapper';

const JurisdictionModal = observer(({ openPasswordModal }: TJurisdictionModalProps) => {
    const { traders_hub, ui, common } = useStore();

    const { show_eu_related_content } = traders_hub;
    const { disableApp, enableApp } = ui;
    const { platform } = common;

    const { account_type, is_jurisdiction_modal_visible, toggleJurisdictionModal } = useCfdStore();

    const modalTitle = () => {
        if (platform === CFD_PLATFORMS.MT5) {
            return show_eu_related_content
                ? localize('Choose a jurisdiction for your Deriv MT5 CFDs account')
                : localize('Choose a jurisdiction for your Deriv MT5 {{account_type}} account', {
                      account_type: localize(getMT5Title(account_type.type)),
                  });
        } else if (platform === CFD_PLATFORMS.CTRADER) {
            return localize('Choose a jurisdiction for your cTrader account');
        }
    };

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='jurisdiction-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        exit_classname='cfd-modal--custom-exit'
                        is_open={is_jurisdiction_modal_visible}
                        title={modalTitle()}
                        toggleModal={toggleJurisdictionModal}
                        type='button'
                        width={account_type.type === 'financial' ? '1200px' : '1040px'}
                    >
                        <JurisdictionModalContentWrapper openPasswordModal={openPasswordModal} />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={modalTitle()}
                        visible={is_jurisdiction_modal_visible}
                        onClose={toggleJurisdictionModal}
                    >
                        <JurisdictionModalContentWrapper openPasswordModal={openPasswordModal} />
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
});

export default JurisdictionModal;
