import React from 'react';
import { getProfitOrLoss } from 'Modules/Reports/Helpers/profit-loss';

type ProfitLossCellProps = {
    value: string;
};

const ProfitLossCell = ({ value, children }: ProfitLossCellProps) => {
    const status = getProfitOrLoss(value);

    return <span className={`amount--${status}`}>{children}</span>;
};

export default ProfitLossCell;
