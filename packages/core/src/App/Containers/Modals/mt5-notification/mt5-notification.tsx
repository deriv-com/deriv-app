import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper, UILoader, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import MT5NotificationDescription from './mt5-notification-description';

const MT5Notification = observer(() => {
    const { traders_hub } = useStore();
    const { setMT5NotificationModal, is_mt5_notificaiton_modal_visible } = traders_hub;
    const clickHandler = () => {
        setMT5NotificationModal(!is_mt5_notificaiton_modal_visible);
    };

    return (
        <React.Suspense fallback={<UILoader />}>
            <DesktopWrapper>
                <Modal
                    has_close_icon={false}
                    is_open={is_mt5_notificaiton_modal_visible}
                    title={localize('Trouble accessing Deriv MT5 on your mobile?')}
                    toggleModal={clickHandler}
                    className='mt5-notification-modal'
                    height='455px'
                    width='510px'
                >
                    <Modal.Body className='mt5-notification-modal-body'>
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
                    wrapper_classname='mt5-notification-modal-description'
                    title={localize('Trouble accessing Deriv MT5 on your mobile?')}
                    visible={is_mt5_notificaiton_modal_visible}
                    onClose={() => {
                        setMT5NotificationModal(false);
                    }}
                    has_full_height
                    has_close_icon={false}
                    footer={
                        <div className='mt5-notification-modal-description--footer'>
                            <Button
                                className='mt5-notification-modal-description--button'
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
});

export default MT5Notification;
