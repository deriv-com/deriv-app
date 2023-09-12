import React from 'react';
import { Icon } from '@deriv/components';

type TMT5MigrationAccountIconsProps = {
    to: string;
    type: string;
};

const MT5MigrationAccountIcons = ({ to, type }: TMT5MigrationAccountIconsProps) => {
    const getFromAccountIcon = () => {
        switch (type) {
            case 'derived':
                return 'IcMt5SvgDerived';
            case 'financial':
                return 'IcMt5SvgFinancial';
            default:
                return '';
        }
    };

    const getToAccountIcon = (to_type: string) => {
        switch (to_type) {
            case 'bvi_derived':
                return 'IcMt5BviDerived';
            case 'bvi_financial':
                return 'IcMt5BviFinancial';
            case 'vanuatu_derived':
                return 'IcMt5VanuatuDerived';
            case 'vanuatu_financial':
                return 'IcMt5VanuatuFinancial';
            default:
                return '';
        }
    };

    return (
        <React.Fragment>
            <Icon icon={getFromAccountIcon()} height={99} width={96} />
            <Icon icon='IcLongArrowRight' height={24} width={24} />
            <Icon icon={getToAccountIcon(`${to}_${type}`)} height={99} width={96} />
        </React.Fragment>
    );
};

export default MT5MigrationAccountIcons;
