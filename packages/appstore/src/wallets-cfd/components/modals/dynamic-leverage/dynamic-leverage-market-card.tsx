import React from 'react';
import { Table, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TDynamicLeverageMarketCardProps } from 'Containers/props.types';
import { DynamicLeverageTableColumnHeader } from './dynamic-leverage-table-column-header';

export const DynamicLeverageMarketCard = ({ title, description, leverage, data }: TDynamicLeverageMarketCardProps) => (
    <div className='dynamic-leverage-modal__market'>
        <div className='dynamic-leverage-modal__market-title'>
            <Text data-testid='market_title' size='xs' weight='bolder' align='center'>
                {title}
            </Text>
            {!!description && (
                <Text
                    data-testid='description_title'
                    size='xxxs'
                    align='center'
                    className='dynamic-leverage-modal__market-description'
                >
                    {description}
                </Text>
            )}
            <Text data-testid='leverage_title' size='xxs' color='red' align='center'>
                {leverage}
            </Text>
        </div>
        <Table className='dynamic-leverage-modal__market-table'>
            <Table.Header>
                <Table.Row className='dynamic-leverage-modal__market-table-header-row'>
                    <DynamicLeverageTableColumnHeader title={localize('From')} subtitle={localize('(lots)')} />
                    <DynamicLeverageTableColumnHeader title={localize('to')} subtitle={localize('(lots)')} />
                    <DynamicLeverageTableColumnHeader title={localize('Leverage')} subtitle={localize('(1:x)')} />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map(columns => (
                    <Table.Row
                        key={`${columns.from}-${columns.to}-${columns.leverage}`}
                        className='dynamic-leverage-modal__market-table-row'
                    >
                        {Object.entries(columns).map(([column_key, value]) => (
                            <Table.Cell key={`${title}_${column_key}_${value}`}>
                                <Text size='xs' align='center'>
                                    {value}
                                </Text>
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    </div>
);
