import React         from 'react';
import PropTypes     from 'prop-types';
import { Table }     from 'deriv-components';
import { localize }  from 'Components/i18next';
import { BuyTable }  from './buy-table.jsx';
import { SellTable } from './sell-table.jsx';

export const BuySellTable = ({ setSelectedAd, table_type }) => {

    const is_buy = table_type === 'buy';
    const [offer_currency, setOfferCurrency] = React.useState('');
    const [is_agent, setIsAgent] = React.useState(true);

    // TODO: [p2p-cleanup] cleanup repetition of header
    return (
        <Table>
            <Table.Header>
                {is_agent ?
                    <Table.Row>
                        <Table.Head>{localize('Advertiser')}</Table.Head>
                        <Table.Head>{localize('Amount')}</Table.Head>
                        <Table.Head>{localize('Price for 1 {{currency}}', { currency: offer_currency })}</Table.Head>
                        <Table.Head>{localize('Min transaction') }</Table.Head>
                    </Table.Row>
                    :
                    <Table.Row>
                        <Table.Head>{localize('Advertiser')}</Table.Head>
                        <Table.Head>{localize('Amount')}</Table.Head>
                        <Table.Head>{localize('Price for 1 {{currency}}', { currency: offer_currency })}</Table.Head>
                        <Table.Head>{localize('Min transaction') }</Table.Head>
                        <Table.Head>{localize('Trade')}</Table.Head>
                    </Table.Row>
                }
            </Table.Header>
            <Table.Body>
                { is_buy ?
                    <BuyTable
                        setSelectedAd={setSelectedAd}
                        setOfferCurrency={setOfferCurrency}
                        setIsAgent={setIsAgent}
                    />
                    :
                    <SellTable
                        setSelectedAd={setSelectedAd}
                        setOfferCurrency={setOfferCurrency}
                        setIsAgent={setIsAgent}
                    />
                }
            </Table.Body>
        </Table>
    );
};

BuySellTable.propTypes = {
    exchange_to_currency: PropTypes.string,
    setSelectedAd       : PropTypes.func,
    table_type          : PropTypes.string,
};
