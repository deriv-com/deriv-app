import PropTypes from 'prop-types';
import * as React from 'react';
import { formatMoney } from '@deriv/shared';
import AccountLimitsTableCell from './account-limits-table-cell.jsx';
import AccountLimitsContext from './account-limits-context';

const AccountLimitsTurnoverLimitRow = ({ collection, title }) => {
    const { currency } = React.useContext(AccountLimitsContext);

    if (!collection?.length) {
        return null;
    }

    return collection.map(item => (
        <tr key={item.name} data-testid='account-limits-turnover-limit-row'>
            <AccountLimitsTableCell level={item.level}>
                {title && `${title} - `}
                {item.name}
            </AccountLimitsTableCell>
            <AccountLimitsTableCell align='right'>
                {formatMoney(currency, item.turnover_limit, true)}
            </AccountLimitsTableCell>
        </tr>
    ));
};

AccountLimitsTurnoverLimitRow.propTypes = {
    collection: PropTypes.arrayOf(PropTypes.any),
    title: PropTypes.any,
};

export default AccountLimitsTurnoverLimitRow;
