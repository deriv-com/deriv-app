import { Button, Input, Modal, Text } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFD_PLATFORMS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import React from 'react';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';

const MT5MigrationBackSideContent = observer(() => {
    const { ui, common } = useStore();
    const { toggleMT5MigrationModal, setMT5MigrationModalEnabled, is_mobile } = ui;
    const { setAppstorePlatform } = common;
    const { enableCFDPasswordModal, setJurisdictionSelectedShortcode } = useCfdStore();
    const { getEligibleAccountToMigrate } = useMT5SVGEligibleToMigrate();

    const header_size = is_mobile ? 'xs' : 's';
    const content_size = is_mobile ? 'xxs' : 'xs';

    const onConfirmMigration = () => {
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(getEligibleAccountToMigrate());
        setMT5MigrationModalEnabled(true);
        toggleMT5MigrationModal();
        enableCFDPasswordModal();
    };

    return (
        <React.Fragment>
            <div className='mt5-migration-modal__container'>
                <div className='mt5-migration-modal__password-header-container'>
                    <Text as='p' weight='bold' size={header_size} align='center'>
                        <Localize i18n_default_text=' Enter your Deriv MT5 password' />
                    </Text>
                    <Text as='p' size={content_size} align='center'>
                        Enter your Deriv MT5 password to upgrade your account(s).
                    </Text>
                </div>
                <div className='mt5-migration-modal__password-input-container'>
                    <Input />
                </div>
                <div className='mt5-migration-modal__password-forgot-container'>
                    <Button type='button' large secondary>
                        Forgot password?
                    </Button>
                </div>
            </div>
            <Modal.Footer has_separator>
                <Button type='button' large primary onClick={onConfirmMigration}>
                    <Localize i18n_default_text='Upgrade' />
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
});

export default MT5MigrationBackSideContent;
