import React, { memo } from 'react';
import clsx from 'clsx';
import { TOrders } from 'types';
import { Loader, Table, useDevice } from '@deriv-com/ui';
import { OrdersEmpty } from '../OrdersEmpty';
import { OrdersTableRow } from '../OrdersTableRow';
import './OrdersTable.scss';

type TOrdersTableRowRendererProps = TOrders[0];

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

type TOrdersTableProps = {
    data: TOrders;
    isActive: boolean;
    isFetching: boolean;
    isLoading: boolean;
    loadMoreOrders: () => void;
};

const OrdersTable = ({ data, isActive, isFetching, isLoading, loadMoreOrders }: TOrdersTableProps) => {
    const { isMobile } = useDevice();
    if (data?.length === 0 && !isLoading) {
        return <OrdersEmpty />;
    }

    const columns = isActive ? columnsActive : columnsPast;
    return (
        <div className={clsx('p2p-v2-orders-table', { 'p2p-v2-orders-table--inactive': !isActive })}>
            {isLoading ? (
                <Loader />
            ) : (
                <Table
                    columns={isMobile ? [] : columns}
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
