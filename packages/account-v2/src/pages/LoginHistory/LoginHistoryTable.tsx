import React from 'react';
import { Table } from '@deriv-com/ui';

export const LoginHistory = () => {
    // const { data, header } = useLoginHistoryTableData();

    return (
        <div className='flex flex-col '>
            <Table
                columns={[
                    {
                        header: 'Date and Time ',
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
                ]}
                data={[
                    {
                        action: 'Login',
                        browser: 'Chrome v122.0.0.0',
                        datetime: '2024-03-07 12:04:42 GMT',
                        IpAddress: '942',
                        status: 'Successful',
                    },
                ]}
                isFetching={true}
                renderHeader={header => <span>{header}</span>}
                rowRender={data => (
                    <div className='grid grid-flow-col'>
                        <div>{data.action}</div>
                        <div>{data.browser} </div>
                        <div>{data.datetime}</div>
                        <div>{data.IpAddress} </div>
                        <div>{data.status} </div>
                    </div>
                )}
                tableClassname='data.name'
            />
        </div>
    );
};
