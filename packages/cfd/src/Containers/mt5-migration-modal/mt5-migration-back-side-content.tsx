import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { Button, Checkbox, Modal, Text, StaticUrl, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import getMigrationModalDetails from '../../Constants/mt5-migration-modal-content';

type TMT5MigrationBackSideContentProps = {
    setShowModalFrontSide: (value: boolean) => void;
};

const MT5MigrationBackSideContent = observer(({ setShowModalFrontSide }: TMT5MigrationBackSideContentProps) => {
    const { ui, common } = useStore();
    const { toggleMT5MigrationModal, setMT5MigrationModalEnabled, is_mobile } = ui;
    const { setAppstorePlatform } = common;
    const { setJurisdictionSelectedShortcode, setAccountType, enableCFDPasswordModal } = useCfdStore();
    const { getAccountToMigrate, eligible_account_to_migrate } = useMT5SVGEligibleToMigrate();
    const { mt5_migration_error } = useCfdStore();
    const [is_checked, setIsChecked] = React.useState(false);

    const content = getMigrationModalDetails(eligible_account_to_migrate);
    const header_size = is_mobile ? 'xs' : 's';
    const checkbox_text_size = is_mobile ? 'xxs' : 'xs';
    const content_size = is_mobile ? 'xxxs' : 'xs';

    const onConfirmMigration = () => {
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(getAccountToMigrate());
        setMT5MigrationModalEnabled(true);
        toggleMT5MigrationModal();
        setAccountType({ category: 'real', type: 'financial' });
        enableCFDPasswordModal();
    };

    return (
        <React.Fragment>
            {mt5_migration_error && (
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
                                        i18n_default_text='I agree to move my MT5 account(s) and agree to Deriv BVI Ltd’s <0>terms and conditions</0>'
                                        components={[
                                            <StaticUrl key={0} className='link' href={'tnc/deriv-(bvi)-ltd.pdf'} />,
                                        ]}
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
