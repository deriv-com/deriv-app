import React from 'react';
import { LoginHistory } from '@deriv/api-types';
import { Text } from '@deriv-com/ui';
import { formattedLoginHistoryData } from '../../utils';

type TLoginHistoryProps = { loginHistory: LoginHistory };
export const LoginHistoryTableCard = ({ loginHistory }: TLoginHistoryProps) => {
    const formattedLoginHistory = formattedLoginHistoryData(loginHistory);
    return (
        <div className='inline-flex flex-col items-start gap-16 w-full'>
            {formattedLoginHistory.map((item, index) => (
                <div
                    className='shadow-md p-16 rounded-lg background: var(--system-light-8-primary-background, #FFF) w-full'
                    key={index}
                >
                    {/* <div className='shadow-lg p-16 rounded-md background: var(--system-light-8-primary-background, #FFF) w-full'> */}
                    <div className='flex gap-100'>
                        <div className='justify-left flex flex-col items-start gap-8 row-span-3'>
                            <div className='grid grid-row-2 gap-4'>
                                <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                    Date and Time
                                </Text>
                                <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                    {item.date}
                                </Text>
                            </div>
                            <div className='grid grid-row-2 gap-4'>
                                <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                    Browser
                                </Text>
                                <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                    {item.browser}
                                </Text>
                            </div>
                            <div className='grid grid-row-2 gap-4'>
                                <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                    IP Address
                                </Text>
                                <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                    {item.ip}
                                </Text>
                            </div>
                        </div>
                        <div className=' justify-center  items-right col-span-1 flex flex-col  gap-4 '>
                            <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                Action
                            </Text>
                            <Text align='left' color='general' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                {item.action}
                            </Text>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
