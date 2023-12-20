import React from 'react';
import { DesktopWrapper, Modal, PageOverlay, UILoader, MobileWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
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
    } = ui;
    const { mt5_migration_error } = useCfdStore();
    const { no_of_svg_accounts_to_migrate } = useMT5SVGEligibleToMigrate();

    const [show_modal_front_side, setShowModalFrontSide] = React.useState(true);

    const modal_title = (
        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
            <Localize i18n_default_text='Enhancing your trading experience' />
        </Text>
    );

    const closeModal = () => {
        setShowModalFrontSide(true);
        setMT5MigrationModalEnabled(false);
        toggleMT5MigrationModal();
    };

    const getModalHeight = () => {
        if (mt5_migration_error) {
            return 'auto';
        }
        return no_of_svg_accounts_to_migrate > 1 ? '54.2rem' : '44rem';
    };

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <MT5MigrationModalContext.Provider value={{ show_modal_front_side, setShowModalFrontSide }}>
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
                            height={getModalHeight()}
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
                            onClickClose={toggleMT5MigrationModal}
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
