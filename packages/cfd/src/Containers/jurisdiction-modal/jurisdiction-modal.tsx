import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal, UILoader } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from '../../Stores/connect';
import RootStore from '../../Stores/index';
import { getMT5Title } from '@deriv/shared';
import { TJurisdictionModalProps } from '../props.types';
import JurisdictionModalContentWrapper from './jurisdiction-modal-content-wrapper';

const JurisdictionModal = ({
    account_type,
    context,
    disableApp,
    enableApp,
    is_jurisdiction_modal_visible,
    openPasswordModal,
    show_eu_related_content,
    toggleJurisdictionModal,
}: TJurisdictionModalProps) => {
    const modal_title = show_eu_related_content
        ? localize('Choose a jurisdiction for your Deriv MT5 CFDs account')
        : localize('Choose a jurisdiction for your Deriv MT5 {{account_type}} account', {
              account_type: getMT5Title(account_type.type),
          });

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
                        title={modal_title}
                        toggleModal={toggleJurisdictionModal}
                        type='button'
                        context={context}
                        width={account_type.type === 'financial' ? '1200px' : '1040px'}
                    >
                        <JurisdictionModalContentWrapper openPasswordModal={openPasswordModal} context={context} />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='deriv_app'
                        title={modal_title}
                        context={context}
                        visible={is_jurisdiction_modal_visible}
                        onClose={toggleJurisdictionModal}
                    >
                        <JurisdictionModalContentWrapper openPasswordModal={openPasswordModal} context={context} />
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
};

export default connect(({ modules: { cfd }, ui, traders_hub }: RootStore) => ({
    account_type: cfd.account_type,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_jurisdiction_modal_visible: cfd.is_jurisdiction_modal_visible,
    show_eu_related_content: traders_hub.show_eu_related_content,
    toggleJurisdictionModal: cfd.toggleJurisdictionModal,
}))(JurisdictionModal);
