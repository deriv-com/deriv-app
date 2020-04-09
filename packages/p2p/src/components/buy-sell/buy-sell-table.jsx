import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { localize } from 'Components/i18next';
import BuySellTableContent from './buy-table-content.jsx';

export const BuySellTable = ({ setSelectedAd, table_type }) => {
    const is_buy = table_type === 'buy';

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
            <Table.Body>
                <BuySellTableContent key={is_buy.toString()} is_buy={is_buy} setSelectedAd={setSelectedAd} />
            </Table.Body>
        </Table>
    );
};

BuySellTable.propTypes = {
    exchange_to_currency: PropTypes.string,
    setSelectedAd: PropTypes.func,
    table_type: PropTypes.string,
};
