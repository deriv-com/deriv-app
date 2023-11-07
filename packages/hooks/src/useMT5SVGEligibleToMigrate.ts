import React from 'react';
import { useStore } from '@deriv/stores';
import { Jurisdiction, getFormattedJurisdictionCode } from '@deriv/shared';

const useMT5SVGEligibleToMigrate = () => {
    const { client, traders_hub } = useStore();
    const { mt5_login_list } = client;
    const { show_eu_related_content } = traders_hub;

    const mt5_migration_config = React.useMemo(() => {
        const svg_accounts_to_migrate = mt5_login_list.filter(
            account => account.landing_company_short === Jurisdiction.SVG && !!account.eligible_to_migrate
        );

        const has_svg_accounts_to_migrate = !!svg_accounts_to_migrate.length && !show_eu_related_content;

        const no_of_svg_accounts_to_migrate = svg_accounts_to_migrate.length;

        const is_eligible_for_svg_to_bvi_migration = !!svg_accounts_to_migrate.filter(account =>
            Object.values(account.eligible_to_migrate ?? {}).includes(Jurisdiction.BVI)
        ).length;

        const is_eligible_for_svg_to_vanuatu_migration = !!svg_accounts_to_migrate.filter(account =>
            Object.values(account.eligible_to_migrate ?? {}).includes(Jurisdiction.VANUATU)
        ).length;

        const getEligibleAccountToMigrate = () => {
            if (is_eligible_for_svg_to_bvi_migration) {
                return Jurisdiction.BVI;
            } else if (is_eligible_for_svg_to_vanuatu_migration) {
                return Jurisdiction.VANUATU;
            }
        };
        const eligible_account_to_migrate_label = getFormattedJurisdictionCode(getEligibleAccountToMigrate());

        const eligible_svg_to_bvi_derived_accounts = !!svg_accounts_to_migrate.filter(
            account => account.eligible_to_migrate?.synthetic === Jurisdiction.BVI
        ).length;

        const eligible_svg_to_bvi_financial_accounts = !!svg_accounts_to_migrate.filter(
            account => account.eligible_to_migrate?.financial === Jurisdiction.BVI
        ).length;

        const eligible_svg_to_vanuatu_derived_accounts = !!svg_accounts_to_migrate.filter(
            account => account.eligible_to_migrate?.synthetic === Jurisdiction.VANUATU
        ).length;

        const eligible_svg_to_vanuatu_financial_accounts = !!svg_accounts_to_migrate.filter(
            account => account.eligible_to_migrate?.financial === Jurisdiction.VANUATU
        ).length;

        const has_derived_mt5_to_migrate =
            eligible_svg_to_bvi_derived_accounts || eligible_svg_to_vanuatu_derived_accounts;
        const has_financial_mt5_to_migrate =
            eligible_svg_to_bvi_financial_accounts || eligible_svg_to_vanuatu_financial_accounts;
        const has_derived_and_financial_mt5 = has_derived_mt5_to_migrate && has_financial_mt5_to_migrate;

        return {
            eligible_account_to_migrate_label,
            eligible_svg_to_bvi_derived_accounts,
            eligible_svg_to_bvi_financial_accounts,
            eligible_svg_to_vanuatu_derived_accounts,
            eligible_svg_to_vanuatu_financial_accounts,
            getEligibleAccountToMigrate,
            has_derived_and_financial_mt5,
            has_derived_mt5_to_migrate,
            has_svg_accounts_to_migrate,
            no_of_svg_accounts_to_migrate,
            svg_accounts_to_migrate,
        };
    }, [mt5_login_list, show_eu_related_content]);
    return {
        ...mt5_migration_config,
    };
};

export default useMT5SVGEligibleToMigrate;
