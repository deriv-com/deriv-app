import React from 'react';
import { useTransferMessageList } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { AnimatedList, AlertMessage } from '@deriv/components';
import { getAccountName } from 'Constants/utils';
import { formatMoney } from '@deriv/shared';

const message_code_to_message_mapper = {
    WalletToTradingAppDailyLimit: value =>
        localize(
            'The{{remaining}} daily transfer limit between your {{wallet_name}} and {{trading_account_name}} is {{limit_value}} {{currency}}.',
            {
                remaining: !value.is_first_transfer ? ' remaining' : '',
                wallet_name: value.from_name,
                trading_account_name: value.to_name,
                limit_value: formatMoney(value.currency, value.limit, true),
                currency: value.currency,
            }
        ),
    DemoWalletToTradingAppDailyLimit: value =>
        localize('Your{{remaining}} daily transfer limit for virtual funds is {{limit_value}} {{currency}}.', {
            remaining: !value.is_first_transfer ? ' remaining' : '',
            wallet_name: value.from_name,
            trading_account_name: value.to_name,
            limit_value: formatMoney(value.currency, value.limit, true),
            currency: value.currency,
        }),
};

const WalletTransferMessages = ({ from_account, to_account }: any) => {
    const { data: message_list } = useTransferMessageList(from_account, to_account);

    // Translation and currency_exchange happens here

    /*
        message_code: string,                       // for mapping
        is_first_transfer: boolean,                 // for mapping
        limit_value: number,                        // for mapping
        message_type: 'success' | 'error' | 'info', // for <AlertMessage />
        cta: string | undefined                     // for <AlertMessage />
    */

    return (
        <AnimatedList>
            {message_list &&
                message_list.map((msg: any) => {
                    return (
                        <AlertMessage
                            key={msg.code}
                            variant={msg.cta ? 'with-action-button' : 'base'}
                            message={message_code_to_message_mapper[msg.code]({
                                ...msg,
                                from_name: getAccountName({ ...from_account }),
                                to_name: getAccountName({ ...to_account }),
                            })}
                            type={msg.type}
                        />
                    );
                })}
        </AnimatedList>
    );
    return null;
};

export default WalletTransferMessages;
