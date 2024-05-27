import React, { FC } from 'react';
import { WalletText } from '../../../../components/Base';
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
            <WalletText align='center' data-testid='market_title' size='sm' weight='bold'>
                {displayName}
            </WalletText>
            {!!instruments.length && (
                <WalletText align='center' data-testid='description_title' fontStyle='italic' size='2xs'>
                    {`(${instruments.join(', ')})`}
                </WalletText>
            )}
            <WalletText align='center' color='error' data-testid='leverage_title' size='xs'>
                {`Up to ${min}:${max}`}
            </WalletText>
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
                                <WalletText align='center' size='sm'>
                                    {value}
                                </WalletText>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);
