import React from 'react';
import { Button, Modal, Text, StaticUrl } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import {
    getFormattedJurisdictionCode,
    Jurisdiction,
    JURISDICTION_MARKET_TYPES,
    DBVI_COMPANY_NAMES,
    CFD_PLATFORMS,
    getCFDPlatformNames,
} from '@deriv/shared';
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
    const {
        eligible_account_to_migrate_label,
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
        getEligibleAccountToMigrate,
    } = useMT5SVGEligibleToMigrate();

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
                        i18n_default_text='We’re upgrading your {{from_account}} account(s) by moving them to the {{to_account}} jurisdiction.'
                        values={{
                            from_account: getFormattedJurisdictionCode(Jurisdiction.SVG),
                            to_account: eligible_account_to_migrate_label,
                        }}
                    />
                </Text>
            </div>
            <div className='mt5-migration-modal__migration_content'>
                <div className='mt5-migration-modal__migration_content-items'>
                    {eligible_svg_to_bvi_derived_accounts && (
                        <MT5MigrationAccountIcons to={Jurisdiction.BVI} type={JURISDICTION_MARKET_TYPES.DERIVED} />
                    )}
                    {eligible_svg_to_bvi_financial_accounts && (
                        <MT5MigrationAccountIcons to={Jurisdiction.BVI} type={JURISDICTION_MARKET_TYPES.FINANCIAL} />
                    )}
                </div>
                <div className='mt5-migration-modal__migration_content-items'>
                    {eligible_svg_to_vanuatu_derived_accounts && (
                        <MT5MigrationAccountIcons to={Jurisdiction.VANUATU} type={JURISDICTION_MARKET_TYPES.DERIVED} />
                    )}
                    {eligible_svg_to_vanuatu_financial_accounts && (
                        <MT5MigrationAccountIcons
                            to={Jurisdiction.VANUATU}
                            type={JURISDICTION_MARKET_TYPES.FINANCIAL}
                        />
                    )}
                </div>
            </div>
            <div className='mt5-migration-modal__message'>
                <Text as='p' size={content_size} align='center'>
                    <Localize
                        i18n_default_text='By clicking on <0>"Next"</0> you agree to move your {{account}} {{platform}} account(s) under Deriv {{account_to_migrate}} Ltd’s <1>terms and conditions</1>.'
                        components={[
                            <strong key={0} />,
                            <StaticUrl
                                key={0}
                                className='link'
                                href={DBVI_COMPANY_NAMES[getEligibleAccountToMigrate()].tnc_url}
                            />,
                        ]}
                        values={{
                            account: Jurisdiction.SVG.toUpperCase(),
                            platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                            account_to_migrate: eligible_account_to_migrate_label,
                        }}
                    />
                </Text>
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
