import * as React from 'react';
import { formatMoney } from '@deriv/shared';
import AccountLimitsTableCell from './account-limits-table-cell.jsx';
import AccountLimitsContext from './account-limits-context';

type AccountLimitsTurnoverLimitRowProps = {
    collection: unknown;
    title: unknown;
};

const AccountLimitsTurnoverLimitRow = ({ collection, title }: AccountLimitsTurnoverLimitRowProps) => {
    const { currency } = React.useContext(AccountLimitsContext);

    if (!collection?.length) {
        return null;
    }

    return collection.map(item => (
        <tr key={item.name}>
            <AccountLimitsTableCell>
                {title && `${title} - `}
                {item.name}
            </AccountLimitsTableCell>
            <AccountLimitsTableCell align='right'>
                {formatMoney(currency, item.turnover_limit, true)}
            </AccountLimitsTableCell>
        </tr>
    ));
};

export default AccountLimitsTurnoverLimitRow;
