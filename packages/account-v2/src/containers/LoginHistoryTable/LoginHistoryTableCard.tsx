import React from 'react';
import { LoginHistory } from '@deriv/api-types';
import { Text } from '@deriv-com/ui';
import { formattedLoginHistoryData } from '../../utils';

type TLoginHistoryProps = { loginHistory: LoginHistory };
export const LoginHistoryTableCard = ({ loginHistory }: TLoginHistoryProps) => {
    const formattedLoginHistory = formattedLoginHistoryData(loginHistory);
    return (
        <div className='inline-flex flex-col items-start gap-16'>
            {' '}
            {/* Loop through formatted login history data */}{' '}
            {formattedLoginHistory.map((item, index) => (
                <div
                    className='shadow-md p-16 rounded-lg background: var(--system-light-8-primary-background, #FFF)'
                    key={index}
                >
                    {' '}
                    <div className='flex gap-40 align-content-left'>
                        {' '}
                        {/* Date */}{' '}
                        <div className='justify-center flex flex-col items-start gap-8 row-span-3'>
                            {' '}
                            <div className='grid grid-row-2 gap-4'>
                                <Text align='left' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                    {' '}
                                    Date:{' '}
                                </Text>{' '}
                                <Text align='left' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                    {' '}
                                    {item.date}{' '}
                                </Text>
                            </div>
                            <div className='grid grid-row-2 gap-4'>
                                <Text align='left' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                    {' '}
                                    Browser:{' '}
                                </Text>{' '}
                                <Text align='center' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                    {' '}
                                    {item.browser}{' '}
                                </Text>
                            </div>
                            <div className='grid grid-row-2 gap-4'>
                                <Text align='left' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                    {' '}
                                    IP:{' '}
                                </Text>{' '}
                                <Text align='center' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                    {' '}
                                    {item.ip}{' '}
                                </Text>
                            </div>
                        </div>{' '}
                        {/* Browser and Action */}{' '}
                        <div className=' justify-center items-center col-span-1 flex flex-col items-centre gap-4 '>
                            {' '}
                            <Text align='left' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='bold'>
                                {' '}
                                Action:{' '}
                            </Text>{' '}
                            <Text align='center' color='#333' fontStyle='IBM Plex Sans' size='lg' weight='normal'>
                                {' '}
                                {item.action}{' '}
                            </Text>
                        </div>{' '}
                    </div>{' '}
                </div>
            ))}{' '}
        </div>
    );
};
