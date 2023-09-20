import { useStore } from '@deriv/stores';
import { Jurisdiction, getFormattedJurisdictionCode } from '@deriv/shared';

const useMT5SVGEligibleToMigrate = () => {
    const { client } = useStore();
    const { mt5_login_list } = client;

    const svg_accounts_to_migrate = mt5_login_list.filter(
        account => account.landing_company_short === 'svg' && !!account.eligible_to_migrate
    );

    const has_svg_accounts_to_migrate = !!svg_accounts_to_migrate.length;
    const no_of_svg_accounts_to_migrate = svg_accounts_to_migrate.length;

    const is_eligible_for_svg_to_bvi_migration = !!svg_accounts_to_migrate.filter(account =>
        Object.values(account.eligible_to_migrate || {}).includes(Jurisdiction.BVI)
    ).length;

    const is_eligible_for_svg_to_vanuatu_migration = !!svg_accounts_to_migrate.filter(account =>
        Object.values(account.eligible_to_migrate || {}).includes(Jurisdiction.VANUATU)
    ).length;

    const getEligibleAccountToMigrate = () => {
        let account_to_migrate = '';
        if (is_eligible_for_svg_to_bvi_migration) {
            account_to_migrate = Jurisdiction.BVI;
        } else if (is_eligible_for_svg_to_vanuatu_migration) {
            account_to_migrate = Jurisdiction.VANUATU;
        }
        return account_to_migrate;
    };
    const eligible_account_to_migrate_label = getFormattedJurisdictionCode(getEligibleAccountToMigrate());

    const eligible_svg_to_bvi_derived_accounts = !!svg_accounts_to_migrate.filter(account => {
        const { synthetic } = account.eligible_to_migrate;
        return synthetic === Jurisdiction.BVI;
    }).length;

    const eligible_svg_to_bvi_financial_accounts = !!svg_accounts_to_migrate.filter(account => {
        const { financial } = account.eligible_to_migrate;
        return financial === Jurisdiction.BVI;
    }).length;

    const eligible_svg_to_vanuatu_derived_accounts = !!svg_accounts_to_migrate.filter(account => {
        const { synthetic } = account.eligible_to_migrate;
        return synthetic === Jurisdiction.VANUATU;
    }).length;

    const eligible_svg_to_vanuatu_financial_accounts = !!svg_accounts_to_migrate.filter(account => {
        const { financial } = account.eligible_to_migrate;
        return financial === Jurisdiction.VANUATU;
    }).length;

    return {
        getEligibleAccountToMigrate,
        svg_accounts_to_migrate,
        no_of_svg_accounts_to_migrate,
        has_svg_accounts_to_migrate,
        eligible_account_to_migrate_label,
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
    };
};

export default useMT5SVGEligibleToMigrate;
