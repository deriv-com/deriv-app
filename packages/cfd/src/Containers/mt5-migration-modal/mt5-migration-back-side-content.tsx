import { Button, Input, Modal, Text } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { CFD_PLATFORMS, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import React from 'react';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationBackSideContent = observer(() => {
    const { ui, common, client } = useStore();
    const { toggleMT5MigrationModal, setMT5MigrationModalEnabled, is_mobile } = ui;
    const { email } = client;
    const { setAppstorePlatform } = common;
    const { enableCFDPasswordModal, setJurisdictionSelectedShortcode, setSentEmailModalStatus } = useCfdStore();
    const { getEligibleAccountToMigrate } = useMT5SVGEligibleToMigrate();
    const { setShowModalFrontSide } = useMT5MigrationModalContext();

    const header_size = is_mobile ? 'xs' : 's';
    const content_size = is_mobile ? 'xxs' : 'xs';

    const closeModal = () => {
        setShowModalFrontSide(true);
        setAppstorePlatform(CFD_PLATFORMS.MT5);
        setJurisdictionSelectedShortcode(getEligibleAccountToMigrate());
        setMT5MigrationModalEnabled(true);
        toggleMT5MigrationModal();
    };

    const onConfirmMigration = () => {
        closeModal();
        enableCFDPasswordModal();
    };

    const onForgotPassword = () => {
        closeModal();
        WS.verifyEmail(email, 'trading_platform_mt5_password_reset', {
            url_parameters: {
                redirect_to: 10,
            },
        });
        setSentEmailModalStatus(true);
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
                    <Button type='button' large secondary onClick={onForgotPassword}>
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
