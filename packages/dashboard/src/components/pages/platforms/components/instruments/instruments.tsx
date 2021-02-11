import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { TStringTranslation } from 'Types';

const Instruments: React.FC<TInstruments> = ({ title, active_symbols = [] }) => {
    return (
        <div className='dw-instruments'>
            <Text as='h2' className='dw-instruments__title' size='m' weight='bold'>
                {title}
            </Text>
            {active_symbols.map(market => (
                <React.Fragment key={`${market.title}`}>
                    <div className='dw-instruments__market'>
                        <div className='dw-instruments__market-header'>
                            <Icon className='dw-instruments__market-icon' icon={market.icon} width='48' height='48' />
                            <div className='dw-instruments__market-title'>
                                <Text size='sm' weight='bold'>
                                    {market.title}
                                </Text>
                                {market.description && <Text>{market.description}</Text>}
                            </div>
                        </div>
                        {market.submarkets.map(submarket => (
                            <div key={`${submarket.title}`} className='dw-instruments__submarket'>
                                <Text className='dw-instruments__submarket-title' size='sm' weight='bold'>
                                    {submarket.title}
                                </Text>
                                {submarket.description && (
                                    <Text className='dw-instruments__submarket-subtitle'>{submarket.description}</Text>
                                )}

                                <div className='dw-instruments__symbol'>
                                    {submarket.symbols.map(symbol => (
                                        <div key={`${symbol.title}`} className='dw-instruments__symbol-item'>
                                            <Icon
                                                className='dw-instruments__symbol-icon'
                                                icon={symbol.icon}
                                                width='40'
                                                height='40'
                                            />
                                            <Text size='xs'>{symbol.title}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

type SymbolType = {
    icon: string;
    title: TStringTranslation;
};

type SubmarketType = {
    title: TStringTranslation;
    description?: TStringTranslation;
    symbols: SymbolType[];
};

type MarketType = {
    icon: string;
    title: TStringTranslation;
    description?: TStringTranslation;
    submarkets: SubmarketType[];
};

type TInstruments = {
    title: TStringTranslation;
    active_symbols: MarketType[];
};

export default Instruments;
