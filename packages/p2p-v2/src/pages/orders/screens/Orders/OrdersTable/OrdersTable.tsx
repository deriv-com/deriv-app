import React, { memo, useState } from 'react';
import { ORDERS_STATUS } from '@/constants/orders';
import { useQueryString } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { Loader, Table } from '@deriv-com/ui';
import { OrdersTableHeader } from '../OrdersTableHeader';
import { OrdersTableRow } from '../OrdersTableRow';
import './OrdersTable.scss';

// eslint-disable-next-line @typescript-eslint/ban-types
export type TOrdersTableRowRendererProps = {};

const OrdersTableRowRenderer = memo((values: TOrdersTableRowRendererProps) => <OrdersTableRow {...values} />);
OrdersTableRowRenderer.displayName = 'OrdersTableRowRenderer';

const headerRenderer = (header: string) => <span>{header}</span>;

const columnsActive = [
    {
        header: 'Order',
    },
    {
        header: 'Order ID',
    },
    {
        header: 'Counterparty',
    },
    {
        header: 'Status',
    },
    {
        header: 'Send',
    },
    {
        header: 'Receive',
    },
    {
        header: 'Time',
    },
];

const columnsPast = [
    {
        header: 'Date',
    },
    {
        header: 'Order',
    },
    {
        header: 'Order ID',
    },
    {
        header: 'Counterparty',
    },
    {
        header: 'Status',
    },
    {
        header: 'Send',
    },
    {
        header: 'Receive',
    },
];

const OrdersTable = () => {
    const [activeTab, setActiveTab] = useState<string>(ORDERS_STATUS.ACTIVE_ORDERS);
    const { queryString, setQueryString } = useQueryString();
    const currentTab = queryString.get('tab');

    const {
        data = [],
        isFetching,
        isLoading,
        loadMoreOrders,
    } = p2p.order.useGetList({ active: activeTab === ORDERS_STATUS.ACTIVE_ORDERS ? 1 : 0 });
    return (
        <div className='p2p-v2-orders-table'>
            <OrdersTableHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {isLoading ? (
                <div>
                    <Loader />
                </div>
            ) : (
                <Table
                    columns={activeTab === ORDERS_STATUS.ACTIVE_ORDERS ? columnsActive : columnsPast}
                    data={data}
                    isFetching={isFetching}
                    loadMoreFunction={loadMoreOrders}
                    renderHeader={headerRenderer}
                    rowRender={(rowData: unknown) => (
                        <OrdersTableRowRenderer {...(rowData as TOrdersTableRowRendererProps)} />
                    )}
                />
            )}
        </div>
    );
};

export default OrdersTable;
