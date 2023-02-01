import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'Stores/connect';
import { Button, DesktopWrapper, MobileDialog, MobileWrapper, Modal, Text, UILoader } from '@deriv/components';
import { isMobile, routes, ContentFlag } from '@deriv/shared';
import { localize } from '@deriv/translations';

const ExitTradersHubModal = ({
    disableApp,
    enableApp,
    is_exit_traders_hub_modal_visible,
    toggleExitTradersHubModal,
    setIsPreAppStore,
    switchToCRAccount,
    content_flag,
}) => {
    const history = useHistory();

    const exit_traders_hub_modal_content = (
        <Text size={isMobile() ? 'xxs' : 'xs'}>
            {localize(`You won’t be able to see your EU account in the traditional view. The open positions in your EU
        account will remain open. You can switch back to this view at any time.`)}
        </Text>
    );

    const ModalContent = () => {
        return (
            <React.Fragment>
                <Modal.Body>{exit_traders_hub_modal_content}</Modal.Body>
                <Modal.Footer has_separator>
                    <Button onClick={closeModal} has_effect text={localize('Not now')} secondary large />
                    <Button has_effect onClick={onClickExitButton} text={localize('Yes, exit')} primary large />
                </Modal.Footer>
            </React.Fragment>
        );
    };

    const closeModal = () => {
        toggleExitTradersHubModal();
    };

    const onClickExitButton = async () => {
        toggleExitTradersHubModal();
        setIsPreAppStore(false);
        if (content_flag === ContentFlag.LOW_RISK_CR_EU) {
            //if eu is currently selected , switch to non-eu on exiting tradershub
            await switchToCRAccount();
        }
        history.push(routes.root);
    };
    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={is_exit_traders_hub_modal_visible}
                    title={localize('Are you sure?')}
                    toggleModal={closeModal}
                    type='button'
                    height='256px'
                    width='440px'
                    className='exit-traders-hub-modal'
                >
                    <ModalContent />
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='deriv_app'
                    title={localize('Are you sure?')}
                    visible={is_exit_traders_hub_modal_visible}
                    onClose={closeModal}
                    has_full_height
                    wrapper_classname='exit-traders-hub-modal_mobile_content'
                >
                    <ModalContent />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default connect(({ ui, client, traders_hub }) => ({
    setIsPreAppStore: client.setIsPreAppStore,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    is_exit_traders_hub_modal_visible: ui.is_exit_traders_hub_modal_visible,
    toggleExitTradersHubModal: ui.toggleExitTradersHubModal,
    content_flag: traders_hub.content_flag,
    switchToCRAccount: traders_hub.switchToCRAccount,
}))(ExitTradersHubModal);
