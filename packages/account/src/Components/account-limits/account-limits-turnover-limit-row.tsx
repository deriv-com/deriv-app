import { useContext, Fragment } from 'react';
import { FormatUtils, CurrencyConstants } from '@deriv-com/utils';
import AccountLimitsTableCell from './account-limits-table-cell';
import AccountLimitsContext, { TAccountLimitsContext } from './account-limits-context';

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
};

const AccountLimitsTurnoverLimitRow = ({ collection, title }: TAccountLimitsTurnoverLimitRow) => {
    const { currency } = useContext<TAccountLimitsContext>(AccountLimitsContext);

    return (
        <Fragment>
            {collection?.map(({ name, turnover_limit, level }) => (
                <tr key={name} data-testid='account-limits-turnover-limit-row'>
                    <AccountLimitsTableCell level={level}>
                        {title && `${title} - `}
                        {name}
                    </AccountLimitsTableCell>
                    <AccountLimitsTableCell align='right'>
                        {FormatUtils.formatMoney(turnover_limit, { currency: currency as CurrencyConstants.Currency })}
                    </AccountLimitsTableCell>
                </tr>
            ))}
        </Fragment>
    );
};

export default AccountLimitsTurnoverLimitRow;
