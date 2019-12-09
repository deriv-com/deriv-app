import React         from 'react';
import PropTypes     from 'prop-types';
import { Table }     from 'deriv-components';
import { localize }  from 'deriv-translations';
import { BuyTable }  from './buy-table.jsx';
import { SellTable } from './sell-table.jsx';

export const BuySellTable = ({ table_type, setSelectedAd, exchange_amount, exchange_to_currency }) => {
    const is_buy = table_type === 'buy';

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.Head>{localize('Advertisers')}</Table.Head>
                    <Table.Head>{localize('Amount')}</Table.Head>
                    <Table.Head>{localize('Price for')}{' '}{exchange_amount}{' '}{exchange_to_currency}</Table.Head>
                    <Table.Head>{localize('Min transaction') }</Table.Head>
                    <Table.Head>{localize('Payment Method')}</Table.Head>
                    <Table.Head>{localize('Trade')}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                { is_buy ?
                    <BuyTable setSelectedAd={setSelectedAd} /> :
                    <SellTable setSelectedAd={setSelectedAd} />
                }
            </Table.Body>
        </Table>
    );
};

BuySellTable.propTypes = {
    exchange_amount     : PropTypes.string,
    exchange_to_currency: PropTypes.string,
    setSelectedAd       : PropTypes.func,
    table_type          : PropTypes.string,
};
