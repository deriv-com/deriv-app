import React from 'react';
import { LoginHistory } from '@deriv/api-types';
import { Text } from '@deriv-com/ui';
import { formattedLoginHistoryData } from '../../utils';

type TLoginHistoryProps = { loginHistory: LoginHistory };

export const LoginHistoryTableCard = ({ loginHistory }: TLoginHistoryProps) => {
    const formattedLoginHistory = formattedLoginHistoryData(loginHistory);

    return (
        <div className='inline-flex flex-col items-start gap-16 w-full'>
            {formattedLoginHistory.map(item => (
                <div
                    className='shadow-md p-16 rounded-lg bg-[var(--system-light-8-primary-background,#FFF)] w-full'
                    key={item.ip}
                >
                    <div className='flex gap-40'>
                        <div className='justify-left flex flex-col items-start gap-8 row-span-3'>
                            {[
                                { label: 'Date and Time', value: item.date },
                                { label: 'Browser', value: item.browser },
                                { label: 'IP Address', value: item.ip },
                            ].map((gridItem, gridIndex) => (
                                <div className='grid grid-row-2 gap-4' key={gridIndex}>
                                    <Text align='left' color='general' size='lg' weight='bold'>
                                        {gridItem.label}
                                    </Text>
                                    <Text align='left' color='general' size='lg' weight='normal'>
                                        {gridItem.value}
                                    </Text>
                                </div>
                            ))}
                        </div>
                        <div className='justify-center items-right col-span-1 flex flex-col gap-4'>
                            <Text align='left' color='general' size='lg' weight='bold'>
                                Action
                            </Text>
                            <Text align='left' color='general' size='lg' weight='normal'>
                                {item.action}
                            </Text>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
