import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { getFormattedJurisdictionCode, Jurisdiction, JURISDICTION_MARKET_TYPES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import MT5MigrationAccountIcons from './mt5-migration-account-icons';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';

const MT5MigrationFrontSideContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const content_size = is_mobile ? 'xs' : 's';
    const {
        eligible_account_to_migrate_label,
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
    } = useMT5SVGEligibleToMigrate();
    const { setShowModalFrontSide } = useMT5MigrationModalContext();

    return (
        <React.Fragment>
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
            <div>
                <Text as='p' size={content_size} align='center'>
                    <Localize
                        i18n_default_text='Click <0>Next</0> to start your transition.'
                        components={[<strong key={0} />]}
                    />
                </Text>
            </div>
            <Modal.Footer has_separator>
                <Button type='button' has_effect large primary onClick={() => setShowModalFrontSide(false)}>
                    <Localize i18n_default_text='Next' />
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
});
export default MT5MigrationFrontSideContent;
