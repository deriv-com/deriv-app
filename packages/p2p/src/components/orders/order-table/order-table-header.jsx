import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { localize } from 'Components/i18next';

const OrderTableHeader = ({ children }) => (
    <Table>
        <Table.Header>
            <Table.Row>
                <Table.Head>{localize('Order ID')}</Table.Head>
                <Table.Head>{localize('Time')}</Table.Head>
                <Table.Head>{localize('Status')}</Table.Head>
                <Table.Head>{localize('Send')}</Table.Head>
                <Table.Head>{localize('Receive')}</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>{children}</Table.Body>
    </Table>
);

OrderTableHeader.propTypes = {
    children: PropTypes.any,
};

export default OrderTableHeader;
