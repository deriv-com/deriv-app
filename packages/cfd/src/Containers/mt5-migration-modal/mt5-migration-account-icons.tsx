import React from 'react';
import { Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Jurisdiction, JURISDICTION_MARKET_TYPES } from '@deriv/shared';

type TMT5MigrationAccountIconsProps = {
    to: string;
    type: string;
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
        <React.Fragment>
            <Icon icon={getFromAccountIcon()} size={96} />
            <Icon icon={is_mobile ? 'IcLongArrowDown' : 'IcLongArrowRight'} size={24} />
            <Icon icon={getToAccountIcon()} size={96} />
        </React.Fragment>
    );
});

export default MT5MigrationAccountIcons;
