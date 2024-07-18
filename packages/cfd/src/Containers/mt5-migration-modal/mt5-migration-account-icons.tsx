import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';

const MT5MigrationAccountIcons = () => {
    const {
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
        no_of_svg_accounts_to_migrate,
    } = useMT5SVGEligibleToMigrate();

    let existing_account_title = 'Existing account';
    let new_account_title = 'New account';

    if (no_of_svg_accounts_to_migrate > 1) {
        existing_account_title = 'Existing accounts';
        new_account_title = 'New accounts';
    }

    return (
        <div className='mt5-migration-modal__migration_content-items__list'>
            <div className='mt5-migration-modal__migration_content-items__list--container'>
                <Text weight='bold' size='xs'>
                    <Localize i18n_default_text='{{existing_account_title}}' values={{ existing_account_title }} />
                </Text>
                <div className='mt5-migration-modal__migration_content-items__list--container__icons'>
                    {(eligible_svg_to_bvi_derived_accounts || eligible_svg_to_vanuatu_derived_accounts) && (
                        <Icon icon='IcMt5SvgStandard' size={96} data_testid='dt_migrate_from_svg_standard' />
                    )}
                    {(eligible_svg_to_bvi_financial_accounts || eligible_svg_to_vanuatu_financial_accounts) && (
                        <Icon icon='IcMt5SvgFinancial' size={96} data_testid='dt_migrate_from_svg_financial' />
                    )}
                </div>
            </div>
            <div className='mt5-migration-modal__migration_content-items__list--container'>
                <Text weight='bold' size='xs'>
                    <Localize i18n_default_text='{{new_account_title}}' values={{ new_account_title }} />
                </Text>
                <div className='mt5-migration-modal__migration_content-items__list--container__icons'>
                    {eligible_svg_to_bvi_derived_accounts && (
                        <Icon icon='IcMt5BviStandard' size={96} data_testid='dt_migrate_to_bvi_standard' />
                    )}
                    {eligible_svg_to_bvi_financial_accounts && (
                        <Icon icon='IcMt5BviFinancial' size={96} data_testid='dt_migrate_to_bvi_financial' />
                    )}
                    {eligible_svg_to_vanuatu_derived_accounts && (
                        <Icon icon='IcMt5VanuatuStandard' size={96} data_testid='dt_migrate_to_vanuatu_standard' />
                    )}
                    {eligible_svg_to_vanuatu_financial_accounts && (
                        <Icon icon='IcMt5VanuatuFinancial' size={96} data_testid='dt_migrate_to_vanuatu_financial' />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MT5MigrationAccountIcons;
