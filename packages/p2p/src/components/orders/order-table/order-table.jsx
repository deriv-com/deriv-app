import { Table } from '@deriv/components';
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'Components/i18next';
import OrderTableContent from './order-table-content.jsx';

const OrderTable = ({ showDetails }) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row className='orders__table-row orders__table-row--header'>
                    <Table.Head>{localize('Order ID')}</Table.Head>
                    <Table.Head>{localize('Time')}</Table.Head>
                    <Table.Head>{localize('Status')}</Table.Head>
                    <Table.Head>{localize('Send')}</Table.Head>
                    <Table.Head>{localize('Receive')}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <OrderTableContent showDetails={showDetails} />
            </Table.Body>
        </Table>
    );
};

OrderTable.propTypes = {
    orders: PropTypes.array,
    showDetails: PropTypes.func,
};

export default OrderTable;
