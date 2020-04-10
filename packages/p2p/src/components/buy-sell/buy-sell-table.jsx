import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { localize } from 'Components/i18next';

export const BuySellTable = ({ children }) => {
    // last column has an empty header
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>{localize('Advertisers')}</Table.Head>
                    <Table.Head>{localize('Limits')}</Table.Head>
                    <Table.Head>{localize('Price')}</Table.Head>
                    <Table.Head>{localize('Payment method')}</Table.Head>
                    <Table.Head>{''}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>{children}</Table.Body>
        </Table>
    );
};

BuySellTable.propTypes = {
    children: PropTypes.node,
};
