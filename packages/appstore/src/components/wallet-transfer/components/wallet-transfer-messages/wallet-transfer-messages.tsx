import React from 'react';
import { useTransferMessageList } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { AnimatedList, AlertMessage } from '@deriv/components';
import { getAccountName } from 'Constants/utils';
import { formatMoney } from '@deriv/shared';

type TMessageMapperParams = {
    currency: string;
    is_first_transfer: boolean;
    limit: number;
    from_name: string;
    to_name: string;
};

const message_code_to_message_mapper: any = {
    WalletToTradingAppDailyLimit: (value: TMessageMapperParams) =>
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
    DemoWalletToTradingAppDailyLimit: (value: TMessageMapperParams) =>
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

    return (
        <AnimatedList>
            {message_list &&
                message_list.map(msg => {
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
