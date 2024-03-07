import React from 'react';
import { Table } from '@deriv-com/ui';

export const LoginHistoryTable = () => {
    // const { data, header } = useLoginHistoryTableData();

    return (
        <div className='flex flex-col gap-10'>
            <Table
                columns={[
                    {
                        header: 'ID',
                    },
                    {
                        header: 'Name',
                    },
                    {
                        header: 'Team',
                    },
                    {
                        header: 'Country',
                    },
                ]}
                data={[
                    {
                        country: 'Brazil',
                        id: 1,
                        name: 'person489',
                        team: 'civi',
                    },
                    {
                        country: 'UK',
                        id: 2,
                        name: 'person132',
                        team: 'softwar',
                    },
                    {
                        country: 'China',
                        id: 3,
                        name: 'person669',
                        team: 'civi',
                    },
                    {
                        country: 'UK',
                        id: 4,
                        name: 'person788',
                        team: ' engineer',
                    },
                    {
                        country: 'Brazil',
                        id: 5,
                        name: 'person647',
                        team: 'civil enginr',
                    },
                    {
                        country: 'Australia',
                        id: 6,
                        name: 'person847',
                        team: 'surgeon',
                    },
                    {
                        country: 'North America',
                        id: 7,
                        name: 'person71',
                        team: 'artist',
                    },
                    {
                        country: 'China',
                        id: 8,
                        name: 'person832',
                        team: 'software engineer',
                    },
                    {
                        country: 'Pakistan',
                        id: 9,
                        name: 'person568',
                        team: 'civil engir',
                    },
                    {
                        country: 'India',
                        id: 10,
                        name: 'person231',
                        team: 'teacher',
                    },
                    {
                        country: 'Brazil',
                        id: 11,
                        name: 'person835',
                        team: 'software engineer',
                    },
                    {
                        country: 'UK',
                        id: 12,
                        name: 'person492',
                        team: 'civngineer',
                    },
                    {
                        country: 'UAE',
                        id: 13,
                        name: 'person993',
                        team: 'civieer',
                    },
                    {
                        country: 'China',
                        id: 14,
                        name: 'person617',
                        team: 'artist',
                    },
                    {
                        country: 'North America',
                        id: 15,
                        name: 'person116',
                        team: 'civil engineer',
                    },
                ]}
                isFetching={true}
                renderHeader={header => <span>{header}</span>}
                rowRender={data => (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        <div>{data.id}</div>
                        <div>{data.name} </div>
                        <div>{data.team}</div>
                        <div>{data.country} </div>
                    </div>
                )}
                tableClassname='data.name'
            />
        </div>
    );
};
