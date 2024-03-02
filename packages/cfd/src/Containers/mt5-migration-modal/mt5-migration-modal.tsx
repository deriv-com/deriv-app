import React, { useEffect } from 'react';
import { DesktopWrapper, Modal, PageOverlay, UILoader, MobileWrapper, Text, Dialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import MT5MigrationModalContent from './mt5-migration-modal-content';
import { MT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationModal = observer(() => {
    const { ui } = useStore();
    const {
        disableApp,
        enableApp,
        is_mt5_migration_modal_open,
        is_mobile,
        toggleMT5MigrationModal,
        setMT5MigrationModalEnabled,
        is_mt5_migration_modal_enabled,
    } = ui;

    const [show_modal_front_side, setShowModalFrontSide] = React.useState(true);
    const [migration_error, setMigrationError] = React.useState('');
    const modal_title = (
        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
            {show_modal_front_side ? (
                <Localize i18n_default_text='Upgrade your MT5 account' />
            ) : (
                <Localize i18n_default_text='Enter your Deriv MT5 password' />
            )}
        </Text>
    );
    //new
    React.useEffect(() => {
        if (is_mt5_migration_modal_enabled) {
            setShowModalFrontSide(false);
        }
    }, [is_mt5_migration_modal_enabled, setShowModalFrontSide, is_mt5_migration_modal_open]);

    const closeModal = () => {
        setMT5MigrationModalEnabled(false);
        setShowModalFrontSide(true);
        toggleMT5MigrationModal();
    };

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <MT5MigrationModalContext.Provider
                    value={{ show_modal_front_side, setShowModalFrontSide, setMigrationError }}
                >
                    <Dialog
                        title={localize('Sorry for the interruption')}
                        confirm_button_text={localize('Try again')}
                        onConfirm={() => {
                            setMigrationError('');
                            closeModal();
                        }}
                        disableApp={disableApp}
                        enableApp={enableApp}
                        has_close_icon
                        className='mt5-migration-modal__error-dialog'
                        is_visible={!!migration_error}
                        onClose={() => {
                            setMigrationError('');
                            // setMT5MigrationModalEnabled(false); // new
                            // setShowModalFrontSide(true); //new
                        }}
                    >
                        <Localize i18n_default_text='{{migration_error}}' values={{ migration_error }} />
                    </Dialog>
                    <DesktopWrapper>
                        <Modal
                            className='mt5-migration-modal'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            exit_classname='cfd-modal--custom-exit'
                            is_open={is_mt5_migration_modal_open}
                            title={modal_title}
                            toggleModal={closeModal}
                            width='58.8rem'
                            has_return_icon={!show_modal_front_side}
                            onReturn={() => setShowModalFrontSide(true)}
                        >
                            <MT5MigrationModalContent />
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <PageOverlay
                            is_open={is_mt5_migration_modal_open}
                            header_classname='mt5-migration-modal__mobile-header'
                            portal_id='deriv_app'
                            header={modal_title}
                            onClickClose={() => {
                                toggleMT5MigrationModal();
                                setShowModalFrontSide(true);
                            }}
                            has_return_icon={!show_modal_front_side}
                            onReturn={() => setShowModalFrontSide(true)}
                        >
                            <MT5MigrationModalContent />
                        </PageOverlay>
                    </MobileWrapper>
                </MT5MigrationModalContext.Provider>
            </React.Suspense>
        </div>
    );
});

export default MT5MigrationModal;
