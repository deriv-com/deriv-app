import React from 'react';
import { Modal, UILoader } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { CFD_PLATFORMS, Jurisdiction } from '@deriv/shared';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { TOpenAccountTransferMeta } from '../props.types';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import MT5MigrationFrontSideContent from './mt5-migration-front-side-content';
import MT5MigrationBackSideContent from './mt5-migration-back-side-content';

type TMT5MigrationModalProps = {
    openPasswordModal: (acc_type: TOpenAccountTransferMeta) => void;
};

const MT5MigrationModal = observer(({ openPasswordModal }: TMT5MigrationModalProps) => {
    const { ui, common } = useStore();

    const { disableApp, enableApp, is_mt5_migration_modal_open, toggleMT5MigrationModal, setMT5MigrationModalEnabled } =
        ui;
    const { setAppstorePlatform } = common;
    const { setJurisdictionSelectedShortcode } = useCfdStore();

    const { svg_accounts_to_migrate, no_of_svg_accounts_to_migrate, eligible_account_to_migrate } =
        useMT5SVGEligibleToMigrate();
    const [show_modal_front_side, setShowModalFrontSide] = React.useState(true);

    const modal_title = <Localize i18n_default_text='Enhancing your trading experience' />;

    React.useEffect(() => {
        if (svg_accounts_to_migrate.length && !is_mt5_migration_modal_open) {
            toggleMT5MigrationModal(true);
        }
    }, []);

    const getModalHeight = () => {
        if (show_modal_front_side) {
            return no_of_svg_accounts_to_migrate < 1 ? '54.2rem' : '44rem';
        }
        return '61.6rem';
    };

    const onConfirmMigration = () => {
        toggleMT5MigrationModal(false);
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(
            eligible_account_to_migrate === 'BVI' ? Jurisdiction.BVI : Jurisdiction.VANUATU
        );
        setMT5MigrationModalEnabled(true);
        openPasswordModal({ category: 'real', type: 'financial' });
    };

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <Modal
                    className='mt5-migration-modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    exit_classname='cfd-modal--custom-exit'
                    is_open={is_mt5_migration_modal_open}
                    title={modal_title}
                    toggleModal={() => toggleMT5MigrationModal(false)}
                    width='58.8rem'
                    height={getModalHeight()}
                >
                    {show_modal_front_side ? (
                        <MT5MigrationFrontSideContent setShowModalFrontSide={setShowModalFrontSide} />
                    ) : (
                        <MT5MigrationBackSideContent
                            to_account={eligible_account_to_migrate}
                            setShowModalFrontSide={setShowModalFrontSide}
                            onConfirmMigration={onConfirmMigration}
                        />
                    )}

                    {/* <Modal.Footer has_separator>
                        {show_modal_front_side ? (
                            <Button type='button' has_effect large primary onClick={() => setShowModalFrontSide(false)}>
                                <Localize i18n_default_text='Next' />
                            </Button>
                        ) : (
                            <React.Fragment>
                                <Button type='button' large secondary onClick={() => setShowModalFrontSide(true)}>
                                    <Localize i18n_default_text='Back' />
                                </Button>

                                <Button type='button' large primary onClick={onConfirmMigration}>
                                    <Localize i18n_default_text='Next' />
                                </Button>
                            </React.Fragment>
                        )}
                    </Modal.Footer> */}
                </Modal>
            </React.Suspense>
        </div>
    );
});

export default MT5MigrationModal;
