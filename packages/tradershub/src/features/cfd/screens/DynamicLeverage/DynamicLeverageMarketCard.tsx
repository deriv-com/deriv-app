import React from 'react';
import { THooks } from '@/types';
import { Text } from '@deriv-com/ui';
import { DynamicLeverageTableColumnHeader } from './DynamicLeverageTableColumnHeader';

type TDynamicLeverageMarketCardProps = {
    data: THooks.DynamicLeverage[keyof THooks.DynamicLeverage]['volume']['data'];
    displayName: string;
    instruments: string[];
    max: number;
    min: number;
};

export const DynamicLeverageMarketCard = ({
    data,
    displayName,
    instruments,
    max,
    min,
}: TDynamicLeverageMarketCardProps) => (
    <div className='overflow-hidden border-solid border-1 rounded-default border-system-light-less-prominent-text bg-system-light-hover-background'>
        <div className='flex flex-col h-auto py-10 bg-system-light-secondary-background'>
            <Text align='center' size='sm' weight='bold'>
                {displayName}
            </Text>
            {!!instruments.length && (
                <Text align='center' className='italic'>
                    {`(${instruments.join(', ')})`}
                </Text>
            )}
            <Text align='center' className='text-status-light-danger'>
                {`Up to ${min}:${max}`}
            </Text>
        </div>
        <div className='pb-10'>
            <div className='grid grid-cols-[1fr_0.5fr_1.25fr] justify-items-center py-4 bg-system-light-hover-background'>
                <DynamicLeverageTableColumnHeader subtitle='(lots)' title='From' />
                <DynamicLeverageTableColumnHeader subtitle='(lots)' title='to' />
                <DynamicLeverageTableColumnHeader subtitle='(1:x)' title='Leverage' />
            </div>
            <div>
                {data?.map(columns => (
                    <div
                        className='grid grid-cols-[1fr_0.5fr_1.25fr] justify-items-center py-4 even:bg-system-light-hover-background odd:bg-system-light-secondary-background'
                        key={`${columns.from}-${columns.to}-${columns.leverage}`}
                    >
                        {Object.entries(columns).map(([columnKey, value]) => (
                            <div key={`${displayName}_${columnKey}_${value}`}>
                                <Text align='center' size='sm'>
                                    {value}
                                </Text>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);
