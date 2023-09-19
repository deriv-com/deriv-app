import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFD_PLATFORMS, Jurisdiction, isDesktop } from '@deriv/shared';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { TOpenAccountTransferMeta } from '../props.types';
import MT5MigrationFrontSideContent from './mt5-migration-front-side-content';
import MT5MigrationBackSideContent from './mt5-migration-back-side-content';

type TMT5MigrationModalProps = {
    show_modal_front_side: boolean;
    setShowModalFrontSide: (show_modal_front_side: boolean) => void;
    openPasswordModal: (acc_type: TOpenAccountTransferMeta) => void;
};

const MT5MigrationModalContent = observer(
    ({ show_modal_front_side, setShowModalFrontSide, openPasswordModal }: TMT5MigrationModalProps) => {
        const { ui, common } = useStore();
        const { toggleMT5MigrationModal, setMT5MigrationModalEnabled } = ui;
        const { setAppstorePlatform } = common;
        const { setJurisdictionSelectedShortcode } = useCfdStore();
        const { eligible_account_to_migrate } = useMT5SVGEligibleToMigrate();

        const onConfirmMigration = () => {
            setAppstorePlatform(CFD_PLATFORMS.MT5);
            setJurisdictionSelectedShortcode(
                eligible_account_to_migrate === 'BVI' ? Jurisdiction.BVI : Jurisdiction.VANUATU
            );
            setMT5MigrationModalEnabled(true);
            toggleMT5MigrationModal();
            openPasswordModal({ category: 'real', type: 'financial' });
        };

        return (
            <Div100vhContainer height_offset='150px' is_bypassed={isDesktop()}>
                {show_modal_front_side ? (
                    <MT5MigrationFrontSideContent setShowModalFrontSide={setShowModalFrontSide} />
                ) : (
                    <MT5MigrationBackSideContent
                        to_account={eligible_account_to_migrate}
                        setShowModalFrontSide={setShowModalFrontSide}
                        onConfirmMigration={onConfirmMigration}
                    />
                )}
            </Div100vhContainer>
        );
    }
);

export default MT5MigrationModalContent;
