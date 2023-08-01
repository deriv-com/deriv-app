import React from 'react';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import MT5NotificationDescription from './mt5-notification-description';

const MT5Notification = () => {
    const { traders_hub, ui } = useStores();
    const { is_mt5_notificaiton_modal_visible, setMT5NotificationModal } = traders_hub;
    // const { setMT5NotificationModal } = notifications;
    const { disableApp, enableApp } = ui;

    const onclickFunc = () => {
        if (is_mt5_notificaiton_modal_visible) {
            setMT5NotificationModal(false);
        } else {
            setMT5NotificationModal(true);
        }
    };

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    disableApp={disableApp}
                    enableApp={enableApp}
                    has_close_icon={false}
                    is_open={is_mt5_notificaiton_modal_visible}
                    title={localize('Trouble accessing Deriv MT5 on your mobile?')}
                    toggleModal={onclickFunc}
                    className='mt5-notification-modal'
                    height='455px'
                    width='510px'
                >
                    <Modal.Body has_separator className='mt5-notification-modal-body'>
                        <MT5NotificationDescription />
                    </Modal.Body>
                    <Modal.Footer has_separator>
                        <Button
                            primary
                            onClick={() => {
                                setMT5NotificationModal(false);
                            }}
                        >
                            {localize('OK')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    wrapper_classname='mt5-notification-modal-mobile'
                    title={localize('Trouble accessing Deriv MT5 on your mobile?')}
                    visible={is_mt5_notificaiton_modal_visible}
                    onClose={() => {
                        setMT5NotificationModal(false);
                    }}
                    has_full_height
                    has_close_icon={false}
                    footer={
                        <div className='mt5-notification-modal-mobile--footer'>
                            <Button
                                className='mt5-notification-modal-mobile--button'
                                primary
                                onClick={() => setMT5NotificationModal(false)}
                            >
                                {localize('OK')}
                            </Button>
                        </div>
                    }
                >
                    <MT5NotificationDescription />
                </MobileDialog>
            </MobileWrapper>
        </React.Suspense>
    );
};

export default observer(MT5Notification);
