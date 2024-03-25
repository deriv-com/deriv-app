import React from 'react';
import { LoginHistory } from '@deriv/api-types';
import { Table } from '@deriv-com/ui';
import { useFormattedLoginHistoryData } from '../../hooks/useFormattedLoginHistoryData';

type TLoginHistoryData = {
    loginHistory: LoginHistory | undefined;
};

const headers = {
    action: 'Action',
    browser: 'Browser',
    datetime: 'Date and Time',
    ipAddress: 'IP Address',
    status: 'Status',
};

const columnOrder = ['datetime', 'action', 'browser', 'ipAddress', 'status'] as const;

export const LoginHistoryTable = ({ loginHistory }: TLoginHistoryData) => {
    const columns = columnOrder.map(key => ({ header: headers[key] }));
    return (
        // formatedUtils
        <div className='flex flex-col'>
            <Table
                columns={columns}
                data={useFormattedLoginHistoryData(loginHistory) ?? []}
                isFetching={false}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                loadMoreFunction={() => {}}
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
