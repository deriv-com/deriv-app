import React from 'react';
import { Button, Checkbox, Modal, Text, StaticUrl, Icon } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFD_PLATFORMS, DBVI_COMPANY_NAMES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import getMigrationModalDetails from '../../Constants/mt5-migration-modal-content';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationBackSideContent = observer(() => {
    const { ui, common } = useStore();
    const { toggleMT5MigrationModal, setMT5MigrationModalEnabled, is_mobile } = ui;
    const { setAppstorePlatform } = common;
    const { enableCFDPasswordModal, mt5_migration_error, setJurisdictionSelectedShortcode, setAccountType } =
        useCfdStore();

    const { getEligibleAccountToMigrate, eligible_account_to_migrate_label } = useMT5SVGEligibleToMigrate();
    const { setShowModalFrontSide } = useMT5MigrationModalContext();
    const [is_checked, setIsChecked] = React.useState(false);

    const content = getMigrationModalDetails(eligible_account_to_migrate_label);
    const header_size = is_mobile ? 'xs' : 's';
    const checkbox_text_size = is_mobile ? 'xxs' : 'xs';
    const content_size = is_mobile ? 'xxxs' : 'xs';

    const onConfirmMigration = () => {
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(getEligibleAccountToMigrate());
        setMT5MigrationModalEnabled(true);
        toggleMT5MigrationModal();
        setAccountType({ category: 'real', type: 'financial' }); // TODO: remove hardcoded value once BE is ready
        enableCFDPasswordModal();
    };

    return (
        <React.Fragment>
            {!!mt5_migration_error && (
                <div className='mt5-migration-modal__error'>
                    <div className='mt5-migration-modal__error-header'>
                        <Icon icon='IcAlertDanger' />
                        <Text align='center' size='xs'>
                            <Localize i18n_default_text={mt5_migration_error} value={{ mt5_migration_error }} />
                        </Text>
                    </div>
                </div>
            )}
            <div>
                <div className='mt5-migration-modal__description'>
                    <Text as='p' size={header_size} align='center' weight='bold'>
                        <Localize i18n_default_text='What will happen to the funds in my existing account(s)?' />
                    </Text>
                </div>
                <div className='mt5-migration-modal__existing-accounts'>
                    {content.map(item => (
                        <React.Fragment key={item.key}>
                            <div className='mt5-migration-modal__existing-accounts-card'>
                                <div className='mt5-migration-modal__existing-accounts-card-content'>
                                    <Text as='div' size={header_size} weight='bold'>
                                        {item.title}
                                    </Text>
                                    {item.description.map(({ id, text }) => (
                                        <div key={id}>
                                            <Icon icon='IcGreenArrowCheck' />
                                            <Text size={content_size}>{text}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div>
                    <div className='mt5-migration-modal__existing-accounts-card-content'>
                        <Checkbox
                            value={is_checked}
                            onChange={() => setIsChecked(!is_checked)}
                            label={
                                <Text as='p' size={checkbox_text_size} line_height='xs'>
                                    <Localize
                                        i18n_default_text='I agree to move my {{platform}} account(s) and agree to Deriv {{account_to_migrate}} Ltd’s <0>terms and conditions</0>'
                                        components={[
                                            <StaticUrl
                                                key={0}
                                                className='link'
                                                href={DBVI_COMPANY_NAMES[getEligibleAccountToMigrate()].tnc_url}
                                            />,
                                        ]}
                                        values={{
                                            platform: CFD_PLATFORMS.MT5.toUpperCase(),
                                            account_to_migrate: eligible_account_to_migrate_label,
                                        }}
                                    />
                                </Text>
                            }
                        />
                    </div>
                </div>
            </div>
            <Modal.Footer has_separator>
                <Button type='button' large secondary onClick={() => setShowModalFrontSide(true)}>
                    <Localize i18n_default_text='Back' />
                </Button>

                <Button type='button' large primary onClick={onConfirmMigration} disabled={!is_checked}>
                    <Localize i18n_default_text='Next' />
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
});

export default MT5MigrationBackSideContent;
