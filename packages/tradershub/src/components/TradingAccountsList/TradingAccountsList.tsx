import React from 'react';
import { useActiveTradingAccount, useAuthorize, useTradingAccountsList } from '@deriv/api';
import { qtMerge, Text } from '@deriv/quill-design';
import { IconToCurrencyMapper } from '../../constants/constants';
import useRegulationFlags from '../../hooks/useRegulationFlags';
import { useUIContext } from '../UIProvider';

const TradingAccountsList = () => {
    const { data: tradingAccountsList } = useTradingAccountsList();
    const { data: activeAccount } = useActiveTradingAccount();
    const { switchAccount } = useAuthorize();

    const { getUIState } = useUIContext();
    const activeRegulation = getUIState('regulation');

    const { isEU } = useRegulationFlags(activeRegulation);

    return (
        <div className='lg:w-[500px] lg:h-[350px] rounded-400'>
            <div className='flex flex-col items-start self-stretch p-400 gap-200'>
                {tradingAccountsList
                    ?.filter(
                        account => !account.is_virtual && (isEU ? account.broker === 'MF' : account.broker === 'CR')
                    )
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
