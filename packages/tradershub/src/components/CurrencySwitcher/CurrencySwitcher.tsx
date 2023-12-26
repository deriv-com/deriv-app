import React from 'react';
import { useActiveTradingAccount } from '@deriv/api';
import { Button, qtMerge, Text } from '@deriv/quill-design';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { IconToCurrencyMapper } from '../../constants/constants';

const AccountActionButton = () => {
    const { data: activeAccount } = useActiveTradingAccount();

    let buttonText = 'Deposit';
    if (activeAccount?.is_virtual && activeAccount.balance !== 10000) {
        buttonText = 'Reset Balance';
    } else if (activeAccount?.is_virtual) {
        return null;
    }

    return (
        <Button
            className='flex items-center justify-center border-solid h-1600 py-300 px-800 rounded-200 border-sm border-system-light-less-prominent-text'
            colorStyle='black'
            variant='secondary'
        >
            {buttonText}
        </Button>
    );
};

const CurrencySwitcher = () => {
    const { data: activeAccount } = useActiveTradingAccount();

    return (
        <div className='flex items-center justify-between border-solid grow gap-800 h-3600 p-800 rounded-400 border-sm border-system-light-active-background shrink-0'>
            {IconToCurrencyMapper[activeAccount?.currency || 'virtual'].icon}
            <div className='flex items-center justify-between grow gap-800'>
                <div className='flex flex-col justify-center'>
                    <Text
                        bold
                        className={qtMerge('flex', !activeAccount?.is_virtual && 'text-status-light-success')}
                        size='sm'
                    >
                        {activeAccount?.is_virtual ? 'Demo' : activeAccount?.display_balance}
                    </Text>
                    <Text
                        bold={activeAccount?.is_virtual}
                        className={qtMerge(
                            'flex',
                            activeAccount?.is_virtual
                                ? 'text-status-light-information'
                                : 'text-system-light-less-prominent-text'
                        )}
                        size='sm'
                    >
                        {activeAccount?.is_virtual
                            ? activeAccount.display_balance
                            : IconToCurrencyMapper[activeAccount?.currency || 'virtual'].text}
                    </Text>
                </div>
                <AccountActionButton />
                <div className='cursor-pointer'>{!activeAccount?.is_virtual && <StandaloneChevronDownBoldIcon />}</div>
            </div>
        </div>
    );
};

export default CurrencySwitcher;
