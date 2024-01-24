import React, { Fragment } from 'react';
import { IconToCurrencyMapperType } from 'src/constants/constants';
import { THooks } from 'src/types';
import { Text } from '@deriv/quill-design';

type DemoCurrencySwitcherAccountInfoProps = {
    displayBalance: THooks.ActiveTradingAccount['display_balance'];
};

type RealCurrencySwitcherAccountInfoProps = {
    currencyText: IconToCurrencyMapperType['currency_text']['text'];
    displayBalance?: THooks.ActiveTradingAccount['display_balance'];
};

export const DemoCurrencySwitcherAccountInfo = ({ displayBalance }: DemoCurrencySwitcherAccountInfoProps) => (
    <Fragment>
        <Text bold className='font-light text-system-light-less-prominent-text' size='sm'>
            Demo
        </Text>
        <Text bold className='text-status-light-information' size='sm'>
            {displayBalance}
        </Text>
    </Fragment>
);

export const RealCurrencySwitcherAccountInfo = ({
    currencyText,
    displayBalance,
}: RealCurrencySwitcherAccountInfoProps) => (
    <Fragment>
        <Text bold className='text-status-light-success' size='sm'>
            {displayBalance}
        </Text>
        <Text className='text-system-light-less-prominent-text' size='sm'>
            {currencyText}
        </Text>
    </Fragment>
);
