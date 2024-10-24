import { Fragment } from 'react';
import { FormatUtils, CurrencyConstants } from '@deriv-com/utils';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import AccountLimitsTableCell from './account-limits-table-cell';
import AccountLimitsTableHeader from './account-limits-table-header';
import AccountLimitsExtraInfo from './account-limits-extra-info';
import { useGetWithdrawalLimitsDetails } from '@deriv/hooks';

const WithdrawalLimitsTable = observer(() => {
    const { client } = useStore();
    const { withdrawal_limit_details } = useGetWithdrawalLimitsDetails();
    const { currency } = client;

    return (
        <Fragment>
            <table className='da-account-limits__table' data-testid='withdrawal_limits_table'>
                <thead>
                    <tr>
                        <AccountLimitsTableHeader>
                            <Localize i18n_default_text='Withdrawal limits' />
                        </AccountLimitsTableHeader>
                        <AccountLimitsTableHeader align='right'>
                            <Localize i18n_default_text='Limit (USD)' />
                        </AccountLimitsTableHeader>
                    </tr>
                </thead>
                <tbody>
                    <Fragment>
                        {withdrawal_limit_details.map((withdrawal_limit_detail, index) => (
                            <tr key={index}>
                                <AccountLimitsTableCell
                                    className='da-account-limits__table-cell--withdrawal-limit'
                                    renderExtraInfo={() => (
                                        <AccountLimitsExtraInfo
                                            should_display_in_info_tooltip
                                            message={withdrawal_limit_detail.withdrawal_info_message}
                                        />
                                    )}
                                >
                                    {withdrawal_limit_detail.withdrawal_title}
                                </AccountLimitsTableCell>
                                <AccountLimitsTableCell align='right'>
                                    {FormatUtils.formatMoney(
                                        (withdrawal_limit_detail.withdrawal_amount as number) ?? 0,
                                        {
                                            currency: currency as CurrencyConstants.Currency,
                                        }
                                    )}
                                </AccountLimitsTableCell>
                            </tr>
                        ))}
                    </Fragment>
                </tbody>
            </table>
        </Fragment>
    );
});

export default WithdrawalLimitsTable;
