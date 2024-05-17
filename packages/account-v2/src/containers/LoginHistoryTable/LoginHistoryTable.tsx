import React from 'react';
import { LoginHistory } from '@deriv/api-types';
import { Table } from '@deriv-com/ui';
import { formattedLoginHistoryData } from '../../utils';
import { LoginHistoryRow } from './LoginHistoryRow';

type TLoginHistoryProps = {
    loginHistory: LoginHistory;
};

const header = [
    {
        header: 'Date and Time',
    },
    {
        header: 'Action',
    },
    {
        header: 'Browser',
    },
    {
        header: 'IP Address',
    },
    {
        header: 'Status',
    },
];

export const LoginHistoryTable = ({ loginHistory }: TLoginHistoryProps) => {
    const formattedLoginHistory = formattedLoginHistoryData(loginHistory);
    return (
        <div className='flex flex-col'>
            <Table
                columns={header}
                data={formattedLoginHistory}
                loadMoreFunction={() => {
                    //[TODO]: Add load more function
                }}
                renderHeader={header => <span>{header}</span>}
                rowRender={LoginHistoryRow}
            />
        </div>
    );
};
