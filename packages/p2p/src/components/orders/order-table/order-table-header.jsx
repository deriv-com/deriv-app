import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';

const OrderTableHeader = observer(({ children }) => {
    const { general_store } = useStores();

    return (
        <Table className='orders__table'>
            <Table.Header>
                <Table.Row
                    className={classnames('orders__table-grid', {
                        'orders__table-grid--active': general_store.is_active_tab,
                    })}
                >
                    <Table.Head>{localize('Order')}</Table.Head>
                    <Table.Head>{localize('Order ID')}</Table.Head>
                    <Table.Head>{localize('Counterparty')}</Table.Head>
                    <Table.Head>{localize('Status')}</Table.Head>
                    <Table.Head>{localize('Send')}</Table.Head>
                    <Table.Head>{localize('Receive')}</Table.Head>
                    {general_store.order_table_type === 'active' && <Table.Head>{localize('Time')}</Table.Head>}
                </Table.Row>
            </Table.Header>
            <Table.Body className='orders__table-body'>{children}</Table.Body>
        </Table>
    );
});

OrderTableHeader.propTypes = {
    children: PropTypes.any,
    is_active_tab: PropTypes.bool,
};

export default OrderTableHeader;
