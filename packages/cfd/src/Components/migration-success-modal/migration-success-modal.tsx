import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, PageOverlay } from '@deriv/components';
import { Jurisdiction, MT5_ACCOUNT_STATUS, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getFormattedJurisdictionCode } from '../../Stores/Modules/CFD/Helpers/cfd-config';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import MigrationSuccessModalContent from './migration-success-modal-content';

type TMigrationSuccessModal = {
    is_open: boolean;
};

const MigrationSuccessModal = observer(({ is_open }: TMigrationSuccessModal) => {
    const history = useHistory();
    const { ui, client } = useStore();
    const { updateMt5LoginList, mt5_login_list } = client;
    const { is_mobile, setMT5MigrationModalEnabled } = ui;
    const { disableCFDPasswordModal, setError, setCFDSuccessDialog, setMigratedMT5Accounts, migrated_mt5_accounts } =
        useCfdStore();

    React.useEffect(() => {
        if (is_open) {
            updateMt5LoginList();
        }
    }, [is_open, updateMt5LoginList]);

    const has_migrated_mt5_accounts = !!migrated_mt5_accounts.length;
    const eligible_account_migrate = getFormattedJurisdictionCode(
        migrated_mt5_accounts.map(account => Object.values(account?.to_account ?? {})?.[0])?.[0]
    );

    const has_open_positions = mt5_login_list.some(account =>
        migrated_mt5_accounts.some(
            migrated_acc =>
                migrated_acc.login_id === account.login && account.status === MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION
        )
    );

    const toggleModal = () => {
        setMigratedMT5Accounts([]);
        setError(false);
        disableCFDPasswordModal();
        setMT5MigrationModalEnabled(false);
        setCFDSuccessDialog(false);
    };

    const directToCashier = () => {
        toggleModal();
        if (!has_open_positions) {
            history.push(routes.cashier_acc_transfer);
        }
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
                        return 'IcMt5DerivedFinancialBvi';
                    case Jurisdiction.VANUATU:
                        return 'IcMt5DerivedFinancialVanuatu';
                    default:
                        return '';
                }
            }
        }
    };

    return is_mobile ? (
        <PageOverlay
            is_open={is_open && has_migrated_mt5_accounts}
            header_classname='cfd-success-dialog-migration'
            portal_id='deriv_app'
            header=' '
            onClickClose={toggleModal}
        >
            <MigrationSuccessModalContent
                directToCashier={directToCashier}
                icon={getMigrationIcon()}
                eligible_account_migrate={eligible_account_migrate}
                has_open_positions={has_open_positions}
            />
        </PageOverlay>
    ) : (
        <Modal
            className='cfd-success-dialog-migration'
            is_open={is_open && has_migrated_mt5_accounts}
            toggleModal={toggleModal}
            has_close_icon
            title={' '}
            width='58.8rem'
            should_header_stick_body={false}
        >
            <MigrationSuccessModalContent
                directToCashier={directToCashier}
                icon={getMigrationIcon()}
                eligible_account_migrate={eligible_account_migrate}
                has_open_positions={has_open_positions}
            />
        </Modal>
    );
});

export default MigrationSuccessModal;
