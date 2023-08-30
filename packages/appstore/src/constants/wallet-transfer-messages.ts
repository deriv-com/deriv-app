import { localize } from '@deriv/translations';
// discriminated unions for the types of params
const getDailyLimitTransferMessages = (
    limit_value: number,
    limit_currency: number,
    wallet_name: string,
    trading_app_name: string,
    is_first_transfer: boolean
) => {
    return localize(
        'The{{is_first_transfer}} daily transfer limit between your {{wallet_name}} and {{trading_app_name}} is {{limit_value}} {{limit_currency}}.',
        {
            limit_value: limit_value,
            limit_currency: limit_currency,
            wallet_name: wallet_name,
            trading_app_name: trading_app_name,
            is_first_transfer: is_first_transfer ? '' : ' remaining',
        }
    );
};

export { getDailyLimitTransferMessages };
//can have a hook for generating the messages schema and then just pass the message to it
