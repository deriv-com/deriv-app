import React from 'react';
import { observer } from 'mobx-react-lite';
import { withRouter, useHistory } from 'react-router-dom';
import { useStores } from 'Stores';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader, Text, Button } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

const ExitTradersHubModal = () => {
    const history = useHistory();
    const { ui, traders_hub, client } = useStores();
    const { disableApp, enableApp } = ui;
    const { setIsPreAppStore } = client;
    const { is_exit_traders_hub_modal_visible, toggleExitTradersHubModal } = traders_hub;

    const exit_traders_hub_modal_content = (
        <Text size='xs'>
            {localize(`You won’t be able to see your EU account in the traditional view. The open positions in your EU
        account will remain open. You can switch back to this view at any time.`)}
        </Text>
    );

    const closeModal = () => {
        toggleExitTradersHubModal();
    };

    const onClickExitButton = () => {
        toggleExitTradersHubModal();
        setIsPreAppStore(false);
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
                    <Modal.Body>{exit_traders_hub_modal_content}</Modal.Body>
                    <Modal.Footer has_separator>
                        <Button onClick={closeModal} has_effect text={localize('Not now')} secondary large />
                        <Button has_effect onClick={onClickExitButton} text={localize('Yes, exit')} primary large />
                    </Modal.Footer>
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
                    <Modal.Body>{exit_traders_hub_modal_content}</Modal.Body>
                    <Modal.Footer has_separator>
                        <Button onClick={closeModal} has_effect text={localize('Not now')} secondary large />
                        <Button has_effect onClick={onClickExitButton} text={localize('Yes, exit')} primary large />
                    </Modal.Footer>
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default withRouter(observer(ExitTradersHubModal));
