import * as React from 'react';
import { formatMoney } from '@deriv/shared';
import AccountLimitsTableCell from './account-limits-table-cell';
import AccountLimitsContext, { TContextValue } from './account-limits-context';

type TAccountLimitsTurnoverLimitRow = {
    collection: Array<{
        name: string;
        payout_limit: number;
        profile_name: string;
        turnover_limit: number;
    }>;
    title: string;
};

const AccountLimitsTurnoverLimitRow = ({ collection, title }: TAccountLimitsTurnoverLimitRow) => {
    const { currency } = React.useContext<TContextValue>(AccountLimitsContext);

    return (
        <React.Fragment>
            {collection?.map(item => (
                <tr key={item.name} data-testid='account-limits-turnover-limit-row'>
                    <AccountLimitsTableCell>
                        {title && `${title} - `}
                        {item.name}
                    </AccountLimitsTableCell>
                    <AccountLimitsTableCell align='right'>
                        {formatMoney(currency, item.turnover_limit, true)}
                    </AccountLimitsTableCell>
                </tr>
            ))}
        </React.Fragment>
    );
};

export default AccountLimitsTurnoverLimitRow;
