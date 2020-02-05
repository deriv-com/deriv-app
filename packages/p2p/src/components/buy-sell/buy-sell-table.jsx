import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { localize } from 'Components/i18next';
import { BuyTable } from './buy-table.jsx';
import { SellTable } from './sell-table.jsx';

export const BuySellTable = ({ setSelectedAd, table_type }) => {
    const is_buy = table_type === 'buy';

    // TODO: [p2p-cleanup] cleanup repetition of header
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>{localize('Advertisers')}</Table.Head>
                    <Table.Head>{localize('Limits')}</Table.Head>
                    <Table.Head>{localize('Price')}</Table.Head>
                    <Table.Head>{localize('Payment method')}</Table.Head>
                    <Table.Head>{localize('Trade')}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {is_buy ? <BuyTable setSelectedAd={setSelectedAd} /> : <SellTable setSelectedAd={setSelectedAd} />}
            </Table.Body>
        </Table>
    );
};

BuySellTable.propTypes = {
    exchange_to_currency: PropTypes.string,
    setSelectedAd: PropTypes.func,
    table_type: PropTypes.string,
};
