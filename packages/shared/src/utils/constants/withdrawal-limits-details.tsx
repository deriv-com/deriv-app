import { localize } from '@deriv/translations';

export const getWithdrawalTitle = (withdrawal_type: string, num_of_days?: number) => {
    const titles = {
        lifetime_limit: localize('Total withdrawal allowed (Lifetime)'),
        num_of_days_limit: localize('Total withdrawal allowed ({{num_of_days}} days).', { num_of_days }),
        withdrawal_since_inception_monetary: localize('Total withdrawn (Lifetime)'),
        withdrawal_for_x_days_monetary: localize('Total withdrawn ({{num_of_days}} days)', { num_of_days }),
        remainder: localize('Maximum withdrawal remaining'),
    };
    return titles[withdrawal_type as keyof typeof titles] || null;
};

export const getWithdrawalInfoMessage = (withdrawal_type: string) => {
    const messages = {
        lifetime_limit: localize('Total amount you can withdraw over the life of this account.'),
        num_of_days_limit: localize('Total amount you can withdraw over this period.'),
        withdrawal_since_inception_monetary: localize('Total amount withdrawn since account opening.'),
        withdrawal_for_x_days_monetary: localize('Total amount withdrawn over this period.'),
        remainder: localize('Maximum funds available for withdrawal.'),
    };
    return messages[withdrawal_type as keyof typeof messages];
};
