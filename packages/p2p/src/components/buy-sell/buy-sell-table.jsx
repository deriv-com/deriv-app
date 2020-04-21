import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { localize } from 'Components/i18next';
import BuySellTableContent from './buy-sell-table-content.jsx';

export const BuySellTable = ({ children }) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head flex='2fr'>{localize('Advertisers')}</Table.Head>
                    <Table.Head flex='2fr'>{localize('Limits')}</Table.Head>
                    <Table.Head flex='2fr'>{localize('Rate (1 USD)')}</Table.Head>
                    <Table.Head flex='2fr'>{localize('Payment method')}</Table.Head>
                    <Table.Head flex='1fr'>{''}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>{children}</Table.Body>
        </Table>
    );
};

BuySellTable.propTypes = {
    children: PropTypes.node,
};
