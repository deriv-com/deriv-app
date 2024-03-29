import React from 'react';
import { LoginHistory } from '@deriv/api-types';
import { Table } from '@deriv-com/ui';
import { formattedLoginHistoryData } from '../../utils/formattedLoginHistoryData';

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
                isFetching={false}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                loadMoreFunction={() => {
                    //[TODO]:
                }}
                renderHeader={header => <span>{header}</span>}
                rowRender={data => (
                    <div className='grid grid-flow-col text-default'>
                        <span>{data.date}</span>
                        <span>{data.action}</span>
                        <span>{data.browser}</span>
                        <span>{data.ip}</span>
                        <span>{data.status}</span>
                    </div>
                )}
            />
        </div>
    );
};
