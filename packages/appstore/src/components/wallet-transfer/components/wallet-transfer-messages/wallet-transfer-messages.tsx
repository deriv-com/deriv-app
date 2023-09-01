import React from 'react';
import { useTransferMessageList } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { AnimatedList } from '@deriv/components';
import { AlertMessage } from '@deriv/components';
import { getAccountName } from 'Constants/utils';
import { formatMoney } from '@deriv/shared';

const message_code_to_message_mapper: any = {
    WalletToTradingAppDailyLimit: (
        is_first_transfer: boolean,
        limit: string,
        currency: string,
        from_name: string,
        to_name: string
    ) =>
        localize(
            'The{{remaining}} daily transfer limit between your {{wallet_name}} and {{trading_account_name}} is {{limit_value}} {{currency}}.',
            {
                remaining: !is_first_transfer ? ' remaining' : '',
                wallet_name: from_name,
                trading_account_name: to_name,
                limit_value: formatMoney(currency, limit, true),
                currency: currency,
            }
        ),
    DemoWalletToTradingAppDailyLimit: (
        is_first_transfer: boolean,
        limit: string,
        currency: string,
        from_name: string,
        to_name: string
    ) =>
        localize('Your{{remaining}} daily transfer limit for virtual funds is {{limit_value}} {{currency}}.', {
            remaining: !is_first_transfer ? ' remaining' : '',
            wallet_name: from_name,
            trading_account_name: to_name,
            limit_value: formatMoney(currency, limit, true),
            currency: currency,
        }),
};

const WalletTransferMessages = ({ from_account, to_account, setMessageList }: any) => {
    const { data: message_list } = useTransferMessageList(from_account, to_account);

    React.useEffect(() => {
        // setMessageList(message_list);
    }, [message_list]);

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
                    console.log('=> message', msg);
                    return (
                        <AlertMessage
                            key={msg.code}
                            variant={msg.cta ? 'with-action-button' : 'base'}
                            button_label='deposit'
                            message={message_code_to_message_mapper[msg.code](
                                msg.is_first_transfer,
                                msg.limit,
                                msg.currency,
                                msg.mt5_market_type
                            )}
                            onClickHandler={() => {}}
                            type={msg.type}
                        />
                    );
                })}
        </AnimatedList>
    );
    return null;
};

export default WalletTransferMessages;
