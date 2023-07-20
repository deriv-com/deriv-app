import React from 'react';
import { Table, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TDynamicLeverageMarketCardProps } from 'Containers/props.types';

export const DynamicLeverageMarketCard = ({
    market,
    leverage,
    market_example,
    dynamicLeverages,
}: TDynamicLeverageMarketCardProps) => (
    <div className='dynamic-leverage-modal__market'>
        <div className='dynamic-leverage-modal__market-title'>
            <Text size='xs' weight='bolder' align='center'>
                {localize(market)}
            </Text>
            {market_example ? (
                <Text size='xxxs' align='center' className='dynamic-leverage-modal__market-example'>
                    {localize(market_example)}
                </Text>
            ) : null}
            <Text size='xxs' color='red' align='center'>
                {localize(leverage)}
            </Text>
        </div>
        <Table className='dynamic-leverage-modal__market-table'>
            <Table.Header>
                <Table.Row className='dynamic-leverage-modal__market-table-header-row'>
                    <Table.Head>
                        <div className='dynamic-leverage-modal__market-table-header'>
                            <Text size='xs' align='center' weight='bold'>
                                {localize('From')}
                            </Text>
                            <Text size='xxs' align='center'>
                                {localize('(lots)')}
                            </Text>
                        </div>
                    </Table.Head>
                    <Table.Head>
                        <div className='dynamic-leverage-modal__market-table-header'>
                            <Text size='xs' align='center' weight='bold'>
                                {localize('to')}
                            </Text>
                            <Text size='xxs' align='center'>
                                {localize('(lots)')}
                            </Text>
                        </div>
                    </Table.Head>
                    <Table.Head>
                        <div className='dynamic-leverage-modal__market-table-header'>
                            <Text size='xs' align='center' weight='bold'>
                                {localize('Leverage')}
                            </Text>
                            <Text size='xxs' align='center'>
                                {localize('(1:x)')}
                            </Text>
                        </div>
                    </Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {dynamicLeverages.map((x, index) => (
                    <Table.Row key={index} className='dynamic-leverage-modal__market-table-row'>
                        <Table.Cell>
                            <Text size='xs' align='center'>
                                {x.from}
                            </Text>
                        </Table.Cell>
                        <Table.Cell>
                            <Text size='xs' align='center'>
                                {x.to}
                            </Text>
                        </Table.Cell>
                        <Table.Cell>
                            <Text size='xs' align='center'>
                                {x.leverage}
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </div>
);
