import React from 'react';
import { Icon } from '@deriv/components';
import { Jurisdiction, JURISDICTION_MARKET_TYPES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

type TMT5MigrationAccountIconsProps = {
    to: typeof Jurisdiction[keyof typeof Jurisdiction];
    type: typeof JURISDICTION_MARKET_TYPES[keyof typeof JURISDICTION_MARKET_TYPES];
};

const MT5MigrationAccountIcons = observer(({ to, type }: TMT5MigrationAccountIconsProps) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const getFromAccountIcon = () => {
        switch (type) {
            case JURISDICTION_MARKET_TYPES.DERIVED:
                return 'IcMt5SvgDerived';
            case JURISDICTION_MARKET_TYPES.FINANCIAL:
                return 'IcMt5SvgFinancial';
            default:
                return '';
        }
    };

    const getToAccountIcon = () => {
        const to_type = `${to}_${type}`;
        switch (to_type) {
            case `${Jurisdiction.BVI}_${JURISDICTION_MARKET_TYPES.DERIVED}`:
                return 'IcMt5BviDerived';
            case `${Jurisdiction.BVI}_${JURISDICTION_MARKET_TYPES.FINANCIAL}`:
                return 'IcMt5BviFinancial';
            case `${Jurisdiction.VANUATU}_${JURISDICTION_MARKET_TYPES.DERIVED}`:
                return 'IcMt5VanuatuDerived';
            case `${Jurisdiction.VANUATU}_${JURISDICTION_MARKET_TYPES.FINANCIAL}`:
                return 'IcMt5VanuatuFinancial';
            default:
                return '';
        }
    };

    return (
        <div className='mt5-migration-modal__migration_content-items__list'>
            <Icon icon={getFromAccountIcon()} size={96} data_testid={`dt_migrate_from_svg_${type}`} />
            <Icon icon={is_mobile ? 'IcLongArrowDown' : 'IcLongArrowRight'} size={24} />
            <Icon icon={getToAccountIcon()} size={96} data_testid={`dt_migrate_to_${to}_${type}`} />
        </div>
    );
});

export default MT5MigrationAccountIcons;
