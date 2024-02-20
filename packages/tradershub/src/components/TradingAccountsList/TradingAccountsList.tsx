import React from 'react';
import { clsx } from 'clsx';
import { IconToCurrencyMapper } from '@/constants';
import { useRegulationFlags } from '@/hooks';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { Text } from '@deriv-com/ui';

const TradingAccountsList = () => {
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { data: activeAccount } = useActiveTradingAccount();
    const { switchAccount } = useAuthorize();
    const { isEU } = useRegulationFlags();

    return (
        <div className='lg:w-[500px] lg:h-[350px] rounded-default'>
            <div className='flex flex-col items-start self-stretch gap-4 p-8'>
                {tradingAccountsList
                    ?.filter(
                        account => !account.is_virtual && (isEU ? account.broker === 'MF' : account.broker === 'CR')
                    )
                    .map(account => {
                        const iconCurrency = account.currency ?? 'USD';
                        return (
                            <button
                                className={clsx(
                                    'flex items-center self-stretch py-8 px-16 gap-16 rounded-xs cursor-pointer hover:bg-system-light-active-background',
                                    activeAccount?.loginid === account.loginid && 'bg-system-light-active-background'
                                )}
                                key={`trading-accounts-list-${account.loginid}`}
                                onClick={() => switchAccount(account.loginid)}
                            >
                                {IconToCurrencyMapper[iconCurrency].icon}
                                <div className='flex flex-col items-start flex-1'>
                                    <Text size='sm'>{IconToCurrencyMapper[iconCurrency].text}</Text>
                                    <Text size='sm'>{account.loginid}</Text>
                                </div>
                                <div className='text-right'>
                                    <Text size='sm'>{account.display_balance}</Text>
                                </div>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default TradingAccountsList;
