import { useStore } from '@deriv/stores';

const useMT5SVGEligibleToMigrate = () => {
    const { client } = useStore();
    const { mt5_login_list } = client;

    const svg_accounts_to_migrate = mt5_login_list.filter(
        account => account.landing_company_short === 'svg' && !!account.eligible_to_migrate
    );
    const no_of_svg_accounts_to_migrate = svg_accounts_to_migrate.length;

    const is_eligible_for_svg_to_bvi_migration = svg_accounts_to_migrate.some(
        account => account.eligible_to_migrate['synthetic' || 'financial'] === 'bvi'
    );

    const is_eligible_for_svg_to_vanuatu_migration = svg_accounts_to_migrate.some(account => {
        account => account.eligible_to_migrate['synthetic' || 'financial'] === 'vanuatu';
    });
    const eligible_account_to_migrate = is_eligible_for_svg_to_bvi_migration
        ? 'BVI'
        : is_eligible_for_svg_to_vanuatu_migration
        ? 'Vanuatu'
        : '';

    const eligible_svg_to_bvi_derived_accounts = svg_accounts_to_migrate.filter(account => {
        const { synthetic } = account.eligible_to_migrate;
        return synthetic === 'bvi';
    });

    const eligible_svg_to_bvi_financial_accounts = svg_accounts_to_migrate.find(account => {
        const { financial } = account.eligible_to_migrate;
        return financial === 'bvi';
    });

    const eligible_svg_to_vanuatu_derived_accounts = svg_accounts_to_migrate.find(account => {
        const { synthetic } = account.eligible_to_migrate;
        return synthetic === 'vanuatu';
    });

    const eligible_svg_to_vanuatu_financial_accounts = svg_accounts_to_migrate.find(account => {
        const { financial } = account.eligible_to_migrate;
        return financial === 'vanuatu';
    });

    return {
        svg_accounts_to_migrate,
        no_of_svg_accounts_to_migrate,
        eligible_account_to_migrate,
        eligible_svg_to_bvi_derived_accounts,
        eligible_svg_to_bvi_financial_accounts,
        eligible_svg_to_vanuatu_derived_accounts,
        eligible_svg_to_vanuatu_financial_accounts,
    };
};

export default useMT5SVGEligibleToMigrate;
