import React         from 'react';
import PropTypes     from 'prop-types';
import { Table }     from 'deriv-components';
import { BuyTable }  from './buy-table.jsx';
import { SellTable } from './sell-table.jsx';
import { headers }   from './row.jsx';

export const BuySellTable = ({ table_type, setSelectedAd }) => {
    const is_buy = table_type === 'buy';

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    {headers.map(header =>
                        <Table.Head key={header.text}>{header.text}</Table.Head>)}
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
    setSelectedAd: PropTypes.func,
    table_type   : PropTypes.string,
};

