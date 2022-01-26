import React from 'react';
import { getProfitOrLoss } from 'Modules/Reports/Helpers/profit-loss';

type AmountCellProps = {
    value: string;
};

const AmountCell = ({ value }: AmountCellProps) => {
    const status = getProfitOrLoss(value);

    return <span className={`amount--${status}`}>{value}</span>;
};

export default AmountCell;
