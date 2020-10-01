import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';

export const BuySellTable = ({ children }) => {
    const { currency } = React.useContext(Dp2pContext);
    return (
        <Table>
            <Table.Header>
                <Table.Row className='buy-sell__table-row'>
                    <Table.Head>{localize('Advertisers')}</Table.Head>
                    <Table.Head>{localize('Limits')}</Table.Head>
                    <Table.Head>{localize('Rate (1 {{currency}})', { currency })}</Table.Head>
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
