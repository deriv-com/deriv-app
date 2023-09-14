import React from 'react';
import {
    useWalletTransfer,
    useTransferMessageList,
    useTransferMessageListBetweenWalletAndTradingApp,
} from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { AnimatedList, AlertMessage } from '@deriv/components';
import { getAccountName } from 'Constants/utils';
import { formatMoney } from '@deriv/shared';
import { ArrayElement } from 'Types';

type TWalletTransferMessagesProps = {
    from_account: Partial<ReturnType<typeof useWalletTransfer>['from_account']>;
    to_account: Partial<ReturnType<typeof useWalletTransfer>['to_account']>;
};

type TMessageMapperParams = {
    from_name: string;
    to_name: string;
} & ArrayElement<ReturnType<typeof useTransferMessageListBetweenWalletAndTradingApp>>;

type TMessageCodeToMessageMapper = {
    [key in ReturnType<typeof useTransferMessageList>['data'][number]['code']]: (value: TMessageMapperParams) => string;
};

const message_code_to_message_mapper: TMessageCodeToMessageMapper = {
    WalletAndTradingAppDailyLimit: value =>
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
    DemoWalletAndTradingAppDailyLimit: (value: TMessageMapperParams) =>
        localize('Your{{remaining}} daily transfer limit for virtual funds is {{limit_value}} {{currency}}.', {
            remaining: !value.is_first_transfer ? ' remaining' : '',
            wallet_name: value.from_name,
            trading_account_name: value.to_name,
            limit_value: formatMoney(value.currency, value.limit, true),
            currency: value.currency,
        }),
};

const WalletTransferMessages = ({ from_account, to_account }: TWalletTransferMessagesProps) => {
    const { data: message_list } = useTransferMessageList(from_account, to_account);

    return (
        <AnimatedList>
            {message_list &&
                message_list.map(msg => {
                    return (
                        <AlertMessage
                            key={msg.code}
                            variant={'base'}
                            message={message_code_to_message_mapper[msg.code]({
                                ...msg,
                                from_name: getAccountName({ ...from_account }),
                                to_name: getAccountName({ ...to_account }),
                            } as TMessageMapperParams)}
                            type={msg.type}
                        />
                    );
                })}
        </AnimatedList>
    );
};

export default WalletTransferMessages;
