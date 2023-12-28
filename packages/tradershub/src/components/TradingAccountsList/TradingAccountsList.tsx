import React from 'react';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { qtMerge, Text } from '@deriv/quill-design';
import { IconToCurrencyMapper } from '../../constants/constants';

const TradingAccountsList = () => {
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { data: activeAccount } = useActiveTradingAccount();
    const { switchAccount } = useAuthorize();

    return (
        <div className='flex w-[500px] h-[350px] flex-col items-center rounded-400 bg-system-light-primary-background'>
            <div className='flex flex-col items-start self-stretch flex-1 p-400 gap-200'>
                {tradingAccountsList
                    ?.filter(account => !account.is_virtual)
                    .map(account => {
                        const iconCurrency = account.currency ?? 'USD';
                        return (
                            <button
                                className={qtMerge(
                                    'flex items-center self-stretch py-400 px-800 gap-800 rounded-200 cursor-pointer hover:bg-system-light-active-background',
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
