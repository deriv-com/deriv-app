import React, { FC } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
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
}) => {
    const { localize } = useTranslations();
    return (
        <div className='wallets-dynamic-leverage-modal__market'>
            <div className='wallets-dynamic-leverage-modal__market-title'>
                <Text align='center' data-testid='dt_dynamic_leverage_market_title' size='sm' weight='bold'>
                    {displayName}
                </Text>
                {!!instruments.length && (
                    <Text
                        align='center'
                        data-testid='dt_dynamic_leverage_description_title'
                        fontStyle='italic'
                        size='2xs'
                    >
                        {`(${instruments.join(', ')})`}
                    </Text>
                )}
                <Text align='center' color='error' data-testid='dt_dynamic_leverage_title' size='xs'>
                    <Localize i18n_default_text='Up to {{min}}:{{max}}' values={{ max, min }} />
                </Text>
            </div>
            <div className='wallets-dynamic-leverage-modal__market-table'>
                <div className='wallets-dynamic-leverage-modal__market-table-header-row'>
                    <DynamicLeverageTableColumnHeader subtitle={localize('(lots)')} title={localize('From')} />
                    <DynamicLeverageTableColumnHeader subtitle={localize('(lots)')} title={localize('to')} />
                    <DynamicLeverageTableColumnHeader subtitle={localize('(1:x)')} title={localize('Leverage')} />
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
};
