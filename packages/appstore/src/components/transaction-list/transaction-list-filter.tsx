import React from 'react';
import { Dropdown } from '@deriv/components';
import { localize } from '@deriv/translations';

type TTransactionListFilter = {
    onChange: React.ComponentProps<typeof Dropdown>['onChange'];
    options: React.ComponentProps<typeof Dropdown>['list'];
    value: string;
};

const TransactionListFilter = ({ onChange, options, value }: TTransactionListFilter) => {
    return (
        <Dropdown
            className=''
            is_align_text_left
            list={options}
            onChange={onChange}
            placeholder={localize('Filter')}
            value={value}
        />
    );
};

export default TransactionListFilter;
