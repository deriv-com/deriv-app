import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import { getFormattedJurisdictionCode, Jurisdiction } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import MT5MigrationAccountIcons from './mt5-migration-account-icons';

type TMT5MigrationFrontSideContentProps = {
    setShowModalFrontSide: (value: boolean) => void;
};

const MT5MigrationFrontSideContent = observer(({ setShowModalFrontSide }: TMT5MigrationFrontSideContentProps) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const content_size = is_mobile ? 'xs' : 's';
    const {
        eligible_account_to_migrate,
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
    } = useMT5SVGEligibleToMigrate();

    return (
        <React.Fragment>
            <div className='mt5-migration-modal__description'>
                <Text as='p' color='general' size={content_size} align='center'>
                    <Localize
                        i18n_default_text='We’re upgrading your {{from_account}} account(s) by moving them to the {{to_account}} jurisdiction.'
                        values={{
                            from_account: getFormattedJurisdictionCode(Jurisdiction.SVG),
                            to_account: eligible_account_to_migrate,
                        }}
                    />
                </Text>
            </div>
            <div className='mt5-migration-modal__migration_content'>
                <div className='mt5-migration-modal__migration_content-items'>
                    {eligible_svg_to_bvi_derived_accounts && <MT5MigrationAccountIcons to='bvi' type='derived' />}
                    {eligible_svg_to_bvi_financial_accounts && <MT5MigrationAccountIcons to='bvi' type='financial' />}
                </div>
                <div className='mt5-migration-modal__migration_content-items'>
                    {eligible_svg_to_vanuatu_derived_accounts && (
                        <MT5MigrationAccountIcons to='vanuatu' type='derived' />
                    )}
                    {eligible_svg_to_vanuatu_financial_accounts && (
                        <MT5MigrationAccountIcons to='vanuatu' type='financial' />
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
