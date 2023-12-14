import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Modal, Text, InlineMessage } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getCFDPlatformNames, CFD_PLATFORMS, Jurisdiction, MT5_ACCOUNT_STATUS, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getFormattedJurisdictionCode } from '../Stores/Modules/CFD/Helpers/cfd-config';
import { useCfdStore } from '../Stores/Modules/CFD/Helpers/useCfdStores';

type TMigrationSuccessModal = {
    is_open: boolean;
};

const MigrationSuccessModal = observer(({ is_open }: TMigrationSuccessModal) => {
    const history = useHistory();
    const { ui, client } = useStore();
    const { updateMt5LoginList, mt5_login_list } = client;
    const { is_mobile, setMT5MigrationModalEnabled } = ui;
    const {
        disableCFDPasswordModal,
        setError,
        setCFDSuccessDialog,
        //  migrated_mt5_accounts,  // TODO: TESTING
        setMigratedMT5Accounts,
    } = useCfdStore();

    React.useEffect(() => {
        if (is_open) {
            updateMt5LoginList();
        }
    }, [is_open, updateMt5LoginList]);
    const migrated_mt5_accounts = [{ login_id: 'MTR40025895', to_account: { financial: 'vanuatu' } }]; // TODO: TESTING
    const has_migrated_mt5_accounts = !!migrated_mt5_accounts.length;
    const text_size = is_mobile ? 'xxs' : 'xs';
    const platform = getCFDPlatformNames(CFD_PLATFORMS.MT5);
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
    return (
        <Modal
            className='cfd-success-dialog-migration'
            // is_open={is_open && has_migrated_mt5_accounts}
            is_open={true} // TODO: TESTING
            toggleModal={toggleModal}
            has_close_icon
            title={' '}
            width='58.8rem'
            should_header_stick_body={false}
        >
            <Modal.Body
                className={classNames('cfd-success-dialog-migration__body', {
                    'cfd-success-dialog-migration__body-has-open-positions': has_open_positions,
                })}
            >
                <div className='cfd-success-dialog-migration__icon-area'>
                    <Icon icon={`${getMigrationIcon()}`} size={128} />
                </div>
                <div>
                    <Text as='h2' weight='bold' size='s' className='cfd-success-dialog-migration__title'>
                        <Localize i18n_default_text='Success!' />
                    </Text>
                    <div className='cfd-success-dialog-migration__content-wrapper'>
                        <Text size={text_size} as='p' align='center'>
                            <Localize
                                i18n_default_text='Your new <0>{{platform}} {{eligible_account_migrate}}</0> account(s) are ready for trading.'
                                values={{
                                    platform,
                                    eligible_account_migrate,
                                }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <Text size={text_size} as='p' align='center'>
                            <Localize
                                i18n_default_text='For new trades, please transfer your funds into the new <0>{{platform}} {{eligible_account_migrate}}</0>  account(s).'
                                values={{
                                    platform,
                                    eligible_account_migrate,
                                }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                    </div>
                </div>
                {has_open_positions && (
                    <div className='cfd-success-dialog-migration__inline-msg'>
                        <InlineMessage
                            type='information'
                            size='sm'
                            message={
                                <Localize
                                    i18n_default_text='You can continue with the open positions on your current <0>{{platform}} {{existing_account}}</0> account(s).'
                                    values={{
                                        platform,
                                        existing_account: getFormattedJurisdictionCode(Jurisdiction.SVG),
                                    }}
                                    components={[<strong key={0} />]}
                                />
                            }
                        />
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer has_separator className='cfd-success-dialog_migration-footer'>
                <Button has_effect onClick={directToCashier} primary large>
                    {has_open_positions ? (
                        <Localize i18n_default_text='OK' />
                    ) : (
                        <Localize i18n_default_text='Transfer now' />
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default MigrationSuccessModal;
