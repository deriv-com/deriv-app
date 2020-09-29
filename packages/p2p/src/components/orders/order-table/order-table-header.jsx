import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { localize } from 'Components/i18next';

const OrderTableHeader = ({ is_active, children }) => (
    <Table className='orders__table'>
        <Table.Header>
            <Table.Row
                className={classnames('orders__table-grid', {
                    'orders__table-grid--active': is_active,
                })}
            >
                <Table.Head>{localize('Order')}</Table.Head>
                <Table.Head>{localize('Order ID')}</Table.Head>
                <Table.Head>{localize('Counterparty')}</Table.Head>
                <Table.Head>{localize('Status')}</Table.Head>
                <Table.Head>{localize('Send')}</Table.Head>
                <Table.Head>{localize('Receive')}</Table.Head>
                <Table.Head>{localize('Time')}</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>{children}</Table.Body>
    </Table>
);

OrderTableHeader.propTypes = {
    children: PropTypes.any,
    is_active: PropTypes.bool,
};

export default OrderTableHeader;
