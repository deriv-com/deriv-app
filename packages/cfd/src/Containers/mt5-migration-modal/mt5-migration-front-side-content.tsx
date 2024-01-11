import React from 'react';
import { Button, Modal, Text, HintBox } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFD_PLATFORMS, Jurisdiction, getCFDPlatformNames } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import MT5MigrationAccountIcons from './mt5-migration-account-icons';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import Icon from '@deriv/components/src/components/icon/icon';

const MT5MigrationFrontSideContent = observer(() => {
    const { ui, common } = useStore();
    const { is_mobile, setMT5MigrationModalEnabled, toggleMT5MigrationModal } = ui;
    const { setAppstorePlatform } = common;
    const { enableCFDPasswordModal, mt5_migration_error, setJurisdictionSelectedShortcode } = useCfdStore();
    const content_size = is_mobile ? 'xxs' : 'xs';
    const { getEligibleAccountToMigrate } = useMT5SVGEligibleToMigrate();

    const onConfirmMigration = () => {
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(getEligibleAccountToMigrate());
        setMT5MigrationModalEnabled(true);
        toggleMT5MigrationModal();
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
            <div className='mt5-migration-modal__description'>
                <Text as='p' size={content_size} align='center'>
                    <Localize
                        i18n_default_text='We are giving you a new {{platform}} account(s) to enhance your trading experience'
                        values={{
                            platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                        }}
                    />
                </Text>
            </div>
            <div className='mt5-migration-modal__migration_content'>
                <div className='mt5-migration-modal__migration_content-items'>
                    <MT5MigrationAccountIcons />
                </div>
            </div>
            <div className='mt5-migration-modal__migration_infobox'>
                <HintBox
                    icon='IcInfoBlue'
                    message={
                        <Text as='p' size='xxxs'>
                            <Localize
                                i18n_default_text='Your existing <0>{{platform}} {{account}}</0> account(s) will remain accessible.'
                                components={[<strong key={0} />]}
                                values={{
                                    account: Jurisdiction.SVG.toUpperCase(),
                                    platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                                }}
                            />
                        </Text>
                    }
                    is_info
                />
            </div>
            <Modal.Footer has_separator>
                <Button type='button' has_effect large primary onClick={onConfirmMigration}>
                    <Localize i18n_default_text='Next' />
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
});
export default MT5MigrationFrontSideContent;
