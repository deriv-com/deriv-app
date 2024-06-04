import React from 'react';
import { THooks } from 'types';
import { PaymentMethodWithIcon } from '@/components';
import { formatTime } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import './BuySellData.scss';

type TBuySellDataProps = {
    accountCurrency: string;
    expiryPeriod: number;
    instructions?: string;
    isBuy: boolean;
    localCurrency: string;
    name: string;
    paymentMethodNames?: string[];
    paymentMethods: THooks.PaymentMethods.Get;
    rate: string;
};

type TType = THooks.AdvertiserPaymentMethods.Get[number]['type'];
const BuySellData = ({
    accountCurrency,
    expiryPeriod,
    instructions = '',
    isBuy,
    localCurrency,
    name,
    paymentMethodNames,
    paymentMethods,
    rate,
}: TBuySellDataProps) => {
    const { isMobile } = useDevice();
    const labelSize = isMobile ? 'sm' : 'xs';
    const valueSize = isMobile ? 'md' : 'sm';
    const paymentMethodTypes = paymentMethods?.reduce((acc: Record<string, string>, curr) => {
        if (curr.display_name && curr.type) {
            acc[curr.display_name] = curr.type;
        }
        return acc;
    }, {});

    return (
        <div className='p-[2.4rem]'>
            <div className='p2p-v2-buy-sell-data__details'>
                <div className='flex flex-col'>
                    <Text color='less-prominent' size={labelSize}>
                        {isBuy ? 'Buyer' : 'Seller'}
                    </Text>
                    <Text size={valueSize}>{name}</Text>
                </div>
                <div className='flex flex-col'>
                    <Text color='less-prominent' size={labelSize}>{`Rate (1 ${accountCurrency})`}</Text>
                    <Text size={valueSize}>
                        {rate}
                        {localCurrency}
                    </Text>
                </div>
            </div>
            <div className='flex flex-col mb-[1.6rem]'>
                <Text className='mb-[0.8rem]' color='less-prominent' size={labelSize}>
                    Payment methods
                </Text>
                {paymentMethodNames?.length
                    ? paymentMethodNames.map(method => (
                          <PaymentMethodWithIcon
                              className='mb-[0.8rem]'
                              key={method}
                              name={method}
                              type={paymentMethodTypes?.[method] as TType}
                          />
                      ))
                    : '-'}
            </div>
            <div className='flex flex-col mb-[1.6rem]'>
                <Text color='less-prominent' size={labelSize}>{`${isBuy ? 'Buyer' : 'Seller'}'s instructions`}</Text>
                <Text size={valueSize}>{instructions}</Text>
            </div>
            <div className='flex flex-col mb-[1.6rem]'>
                <Text color='less-prominent' size={labelSize}>
                    Orders must be completed in
                </Text>
                <Text size={valueSize}>{formatTime(expiryPeriod)}</Text>
            </div>
        </div>
    );
};

export default BuySellData;
