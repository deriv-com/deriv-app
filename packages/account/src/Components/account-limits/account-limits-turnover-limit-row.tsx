import * as React from 'react';
import { formatMoney } from '@deriv/shared';
import AccountLimitsTableCell from './account-limits-table-cell';

export type TAccountLimitsCollection = {
    level?: string;
    name: string;
    payout_limit: number;
    profile_name: string;
    turnover_limit: number;
};

type TAccountLimitsTurnoverLimitRow = {
    collection: TAccountLimitsCollection[];
    title?: string;
    currency: string;
};

const AccountLimitsTurnoverLimitRow = ({ collection, title, currency }: TAccountLimitsTurnoverLimitRow) => {
    return (
        <React.Fragment>
            {collection?.map(({ name, turnover_limit, level }) => (
                <tr key={name} data-testid='account-limits-turnover-limit-row'>
                    <AccountLimitsTableCell level={level}>
                        {title && `${title} - `}
                        {name}
                    </AccountLimitsTableCell>
                    <AccountLimitsTableCell align='right'>
                        {formatMoney(currency, turnover_limit, true)}
                    </AccountLimitsTableCell>
                </tr>
            ))}
        </React.Fragment>
    );
};

export default AccountLimitsTurnoverLimitRow;
