import React from 'react';
import { Dropdown } from '@deriv/components';
import { localize } from '@deriv/translations';

type TTransactionFilter = {
    onChange: React.ComponentProps<typeof Dropdown>['onChange'];
    options: string[];
    value: string;
};

const TransactionFilter = ({ onChange, options, value }: TTransactionFilter) => {
    return <Dropdown className='' list={options} onChange={onChange} placeholder={localize('Filter')} value={value} />;
};

export default TransactionFilter;
