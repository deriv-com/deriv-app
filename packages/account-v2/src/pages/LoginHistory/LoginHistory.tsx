import React from 'react';
import { Table } from '@deriv-com/ui';

type TRowData = {
    action?: string;
    browser?: string;
    datetime?: string;
    ipAddress?: string;
    status?: string;
};
const columnOrder = ['datetime', 'action', 'browser', 'ipAddress', 'status'] as const;

const headers = {
    datetime: 'Date and Time',
    action: 'Action',
    browser: 'Browser',
    ipAddress: 'IP Address',
    status: 'Status',
};

const columns = columnOrder.map(key => ({ header: headers[key] }));

export const LoginHistory = () => {
    return (
        <div className='flex flex-col '>
            <Table
                columns={columns}
                data={[
                    {
                        action: 'Login',
                        browser: 'Chrome v122.0.0.0',
                        datetime: '2024-03-07 12:04:42 GMT',
                        ipAddress: '942',
                        status: 'Successful',
                    },
                ]}
                isFetching={true}
                renderHeader={header => <span>{header}</span>}
                rowRender={(data: TRowData) => (
                    <div className='grid grid-flow-col'>
                        {Object.keys(data).map(key => (
                            <div key={key}>{data[key as keyof TRowData]}</div>
                        ))}
                        ;
                    </div>
                )}
            />
        </div>
    );
};
