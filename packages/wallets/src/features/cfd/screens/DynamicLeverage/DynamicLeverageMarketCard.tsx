import React, { FC } from 'react';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { DynamicLeverageTableColumnHeader } from './DynamicLeverageTableColumnHeader';
import './DynamicLeverageMarketCard.scss';

type TDynamicLeverageMarketCardProps = {
    data: THooks.DynamicLeverage[keyof THooks.DynamicLeverage]['volume']['data'];
    displayName: string;
    instruments: string[];
    max: number;
    min: number;
};

export const DynamicLeverageMarketCard: FC<TDynamicLeverageMarketCardProps> = ({
    data,
    displayName,
    instruments,
    max,
    min,
}) => (
    <div className='wallets-dynamic-leverage-modal__market'>
        <div className='wallets-dynamic-leverage-modal__market-title'>
            <Text align='center' data-testid='market_title' size='sm' weight='bold'>
                {displayName}
            </Text>
            {!!instruments.length && (
                <Text align='center' data-testid='description_title' fontStyle='italic' size='2xs'>
                    {`(${instruments.join(', ')})`}
                </Text>
            )}
            <Text align='center' color='error' data-testid='leverage_title' size='xs'>
                <Localize i18n_default_text='Up to {{min}}:{{max}}' values={{ max, min }} />
            </Text>
        </div>
        <div className='wallets-dynamic-leverage-modal__market-table'>
            <div className='wallets-dynamic-leverage-modal__market-table-header-row'>
                <DynamicLeverageTableColumnHeader subtitle='(lots)' title='From' />
                <DynamicLeverageTableColumnHeader subtitle='(lots)' title='to' />
                <DynamicLeverageTableColumnHeader subtitle='(1:x)' title='Leverage' />
            </div>
            <div>
                {data?.map(columns => (
                    <div
                        className='wallets-dynamic-leverage-modal__market-table-row'
                        key={`${columns.from}-${columns.to}-${columns.leverage}`}
                    >
                        {Object.entries(columns).map(([columnKey, value]) => (
                            <div key={`${displayName}_${columnKey}_${value}`}>
                                <Text align='center' size='sm'>
                                    {value}
                                </Text>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);
