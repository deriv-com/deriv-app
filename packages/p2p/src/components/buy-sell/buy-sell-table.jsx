import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';

export const BuySellTable = observer(({ children }) => {
    const { general_store } = useStores();

    return (
        <Table>
            <Table.Header>
                <Table.Row className='buy-sell__table-header'>
                    <Table.Head>{localize('Advertisers')}</Table.Head>
                    <Table.Head>{localize('Limits')}</Table.Head>
                    <Table.Head>
                        {localize('Rate (1 {{currency}})', { currency: general_store.client.currency })}
                    </Table.Head>
                    <Table.Head>{''}</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>{children}</Table.Body>
        </Table>
    );
});

BuySellTable.propTypes = {
    children: PropTypes.node,
};
