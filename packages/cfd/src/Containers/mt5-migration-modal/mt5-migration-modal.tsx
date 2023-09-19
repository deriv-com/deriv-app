import React from 'react';
import { DesktopWrapper, Modal, MobileDialog, UILoader, MobileWrapper } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { TOpenAccountTransferMeta } from '../props.types';
import MT5MigrationModalContent from './mt5-migration-modal-content';

type TMT5MigrationModalProps = {
    openPasswordModal: (acc_type: TOpenAccountTransferMeta) => void;
};

const MT5MigrationModal = observer(({ openPasswordModal }: TMT5MigrationModalProps) => {
    const { ui } = useStore();
    const { disableApp, enableApp, is_mt5_migration_modal_open, toggleMT5MigrationModal } = ui;
    const { mt5_migration_error } = useCfdStore();
    const { no_of_svg_accounts_to_migrate, has_svg_accounts_to_migrate } = useMT5SVGEligibleToMigrate();
    const [show_modal_front_side, setShowModalFrontSide] = React.useState(true);

    const modal_title = <Localize i18n_default_text='Enhancing your trading experience' />;

    React.useEffect(() => {
        if (has_svg_accounts_to_migrate) {
            toggleMT5MigrationModal();
        }
    }, [has_svg_accounts_to_migrate, toggleMT5MigrationModal]);

    React.useEffect(() => {
        if (mt5_migration_error) {
            setShowModalFrontSide(false);
        } else {
            setShowModalFrontSide(true);
        }
    }, [mt5_migration_error]);

    const getModalHeight = () => {
        if (show_modal_front_side) {
            return no_of_svg_accounts_to_migrate < 1 ? '54.2rem' : '44rem';
        } else if (mt5_migration_error) {
            return '66rem';
        }
        return '61.6rem';
    };

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='mt5-migration-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        exit_classname='cfd-modal--custom-exit'
                        is_open={is_mt5_migration_modal_open}
                        title={modal_title}
                        toggleModal={toggleMT5MigrationModal}
                        width='58.8rem'
                        height={getModalHeight()}
                    >
                        <MT5MigrationModalContent
                            show_modal_front_side={show_modal_front_side}
                            setShowModalFrontSide={setShowModalFrontSide}
                            openPasswordModal={openPasswordModal}
                        />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        wrapper_classname='mt5-migration-modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        portal_element_id='deriv_app'
                        title={modal_title}
                        visible={is_mt5_migration_modal_open}
                        toggleModal={toggleMT5MigrationModal}
                    >
                        <MT5MigrationModalContent
                            show_modal_front_side={show_modal_front_side}
                            setShowModalFrontSide={setShowModalFrontSide}
                            openPasswordModal={openPasswordModal}
                        />
                    </MobileDialog>
                </MobileWrapper>
            </React.Suspense>
        </div>
    );
});

export default MT5MigrationModal;
