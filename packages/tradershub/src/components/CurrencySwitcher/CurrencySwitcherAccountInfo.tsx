import React from 'react';
import { IconToCurrencyMapperType } from '@/constants';
import { THooks } from '@/types';
import { Text } from '@deriv-com/ui';

type DemoCurrencySwitcherAccountInfoProps = {
    displayBalance: THooks.ActiveTradingAccount['display_balance'];
};

type RealCurrencySwitcherAccountInfoProps = {
    currencyText: IconToCurrencyMapperType['currency_text']['text'];
    displayBalance?: THooks.ActiveTradingAccount['display_balance'];
};

export const DemoCurrencySwitcherAccountInfo = ({ displayBalance }: DemoCurrencySwitcherAccountInfoProps) => (
    <div className='flex flex-col'>
        <Text className='font-light text-system-light-less-prominent-text' size='sm' weight='bold'>
            Demo
        </Text>
        <Text className='text-status-light-information' size='sm' weight='bold'>
            {displayBalance}
        </Text>
    </div>
);

export const RealCurrencySwitcherAccountInfo = ({
    currencyText,
    displayBalance,
}: RealCurrencySwitcherAccountInfoProps) => (
    <div className='flex flex-col'>
        <Text className='text-status-light-success' size='sm' weight='bold'>
            {displayBalance ?? '0.00'}
        </Text>
        <Text className='text-system-light-less-prominent-text' size='sm'>
            {currencyText}
        </Text>
    </div>
);
