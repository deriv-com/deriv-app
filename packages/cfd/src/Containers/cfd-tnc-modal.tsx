import React from 'react';
import classNames from 'classnames';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';
import { Dialog, Text, Button } from '@deriv/components';
import { TOpenAccountTransferMeta } from '../Components/props.types';
import { localize } from '@deriv/translations';
import { getMT5LicenceNotes } from '../Helpers/constants';
import CfdCheckBoxForAccounts from '../Components/cfd-checkbox-for-accounts';

type TCFDTncModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_cfd_tnc_modal_visible: boolean;
    toggleCFDTncModal: () => void;
    toggleCompareAccounts: () => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    account_type: {
        type: string;
        category: string;
    };
    jurisdiction_selected_shortcode: string;
};

const CFDTncModal = ({
    is_cfd_tnc_modal_visible,
    toggleCFDTncModal,
    toggleCompareAccounts,
    disableApp,
    enableApp,
    openPasswordModal,
    account_type,
    jurisdiction_selected_shortcode,
}: TCFDTncModalProps) => {
    const [is_checked, setIsChecked] = React.useState(false);

    React.useEffect(() => {
        setIsChecked(false);
    }, [is_cfd_tnc_modal_visible]);
    const handleCancel = () => {
        toggleCFDTncModal();
        toggleCompareAccounts();
    };
    const handleNext = () => {
        toggleCFDTncModal();
        openPasswordModal(account_type);
    };
    const account_type_name = account_type && account_type.type;

    const ModalContentForTncModal = () => (
        <>
            <div className='cfd-tnc-dialog-content'>
                <Text as='p' align='left' size='xs' line_height='m'>
                    {getMT5LicenceNotes(account_type_name, jurisdiction_selected_shortcode)}
                </Text>
                <div>
                    <CfdCheckBoxForAccounts
                        is_checked={is_checked}
                        onCheck={() => setIsChecked(!is_checked)}
                        class_name={`jurisdiction-checkbox`}
                    />
                </div>
            </div>
            <div className='cfd-tnc-dialog-content--footer'>
                <Button text={localize('Back')} onClick={handleCancel} large secondary />
                <Button
                    text={localize('Next')}
                    onClick={handleNext}
                    disabled={jurisdiction_selected_shortcode !== 'svg' && !is_checked}
                    large
                    primary
                />
            </div>
        </>
    );
    return (
        <Dialog
            is_visible={is_cfd_tnc_modal_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_mobile_full_width={false}
            is_content_centered
            className={classNames('cfd-tnc-modal', {
                'cfd-tnc-modal--svg': jurisdiction_selected_shortcode === 'svg',
            })}
        >
            <ModalContentForTncModal />
        </Dialog>
    );
};
export default connect(({ ui, modules }: RootStore) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_cfd_tnc_modal_visible: modules.cfd.is_cfd_tnc_modal_visible,
    toggleCFDTncModal: modules.cfd.toggleCFDTncModal,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
    account_type: modules.cfd.account_type,
    jurisdiction_selected_shortcode: modules.cfd.jurisdiction_selected_shortcode,
}))(CFDTncModal);
