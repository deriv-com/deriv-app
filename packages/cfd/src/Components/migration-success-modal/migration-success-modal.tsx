import React from 'react';
import { Modal, PageOverlay } from '@deriv/components';
import { Jurisdiction, getFormattedJurisdictionMarketTypes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getFormattedJurisdictionCode } from '../../Stores/Modules/CFD/Helpers/cfd-config';

import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import MigrationSuccessModalContent from './migration-success-modal-content';

type TMigrationSuccessModal = {
    is_open: boolean;
    closeModal: () => void;
};

const MigrationSuccessModal = observer(({ is_open, closeModal }: TMigrationSuccessModal) => {
    const { ui } = useStore();
    const { is_mobile, setMT5MigrationModalEnabled } = ui;
    const { migrated_mt5_accounts, setIsFromMt5MigrationModal } = useCfdStore();

    const has_migrated_mt5_accounts = !!migrated_mt5_accounts.length;
    const eligible_account_to_migrate = getFormattedJurisdictionCode(
        migrated_mt5_accounts.map(account => Object.values(account?.to_account ?? {})?.[0])?.[0]
    );

    const jurisdiction_market_name = migrated_mt5_accounts.map(account =>
        getFormattedJurisdictionMarketTypes(Object.keys(account?.to_account ?? {})?.[0])
    );

    const closeMigrationModals = () => {
        setIsFromMt5MigrationModal(false);
        setMT5MigrationModalEnabled(false);
        closeModal();
    };

    const getMigrationIcon = () => {
        if (has_migrated_mt5_accounts) {
            const to_acc = Object.values(migrated_mt5_accounts[0]?.to_account)?.[0] || '';
            if (migrated_mt5_accounts?.length === 1) {
                switch (to_acc) {
                    case Jurisdiction.BVI:
                        return 'IcMt5Bvi';
                    case Jurisdiction.VANUATU:
                        return 'IcMt5Vanuatu';
                    default:
                        return '';
                }
            } else {
                switch (to_acc) {
                    case Jurisdiction.BVI:
                        return 'IcMt5StandardFinancialBvi';
                    case Jurisdiction.VANUATU:
                        return 'IcMt5StandardFinancialVanuatu';
                    default:
                        return '';
                }
            }
        }
    };

    const ModalContent = () => (
        <MigrationSuccessModalContent
            closePopupModal={closeMigrationModals}
            icon={getMigrationIcon()}
            eligible_account_to_migrate={eligible_account_to_migrate}
            jurisdiction_market_name={jurisdiction_market_name}
        />
    );

    return is_mobile ? (
        <PageOverlay
            is_open={is_open}
            header_classname='cfd-success-dialog-migration'
            portal_id='deriv_app'
            header=' '
            onClickClose={closeMigrationModals}
        >
            <ModalContent />
        </PageOverlay>
    ) : (
        <Modal
            className='cfd-success-dialog-migration'
            is_open={is_open}
            toggleModal={closeMigrationModals}
            has_close_icon
            title=' '
            width='58.8rem'
            should_header_stick_body={false}
        >
            <ModalContent />
        </Modal>
    );
});

export default MigrationSuccessModal;
