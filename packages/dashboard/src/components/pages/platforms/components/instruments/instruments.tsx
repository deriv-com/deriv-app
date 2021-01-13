import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { TStringTranslation } from 'Types'

const Instruments: React.FC<IInstrumentsType> = ({ title, active_symbols = [] }) => {
    return (
        <div className='dw-instruments'>
            <Text className='dw-instruments__title' size='m' weight='bold'>
                {title}
            </Text>
            {active_symbols.map((market, idx) => (
                <React.Fragment key={idx}>
                    <div className='dw-instruments__market'>
                        <Icon className='dw-instruments__market-icon' icon={market.icon} width='48' height='48' />
                        <div className='dw-instruments__market-title'>
                            <Text size='sm' weight='bold'>
                                {market.title}
                            </Text>
                            {market.description && <Text>{market.description}</Text>}
                        </div>
                    </div>
                    {market.submarkets.map((submarket, idy) => (
                        <div key={idy} className='dw-instruments__submarket'>
                            <Text className='dw-instruments__submarket-title' size='sm' weight='bold'>
                                {submarket.title}
                            </Text>
                            {submarket.description && (
                                <Text className='dw-instruments__submarket-subtitle'>{submarket.description}</Text>
                            )}

                            <div className='dw-instruments__symbol'>
                                {submarket.symbols.map((symbol, idz) => (
                                    <div key={idz} className='dw-instruments__symbol-item'>
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
                </React.Fragment>
            ))}
        </div>
    );
};

type SymbolType = {
    icon: string;
    title: TStringTranslation;
}

type SubmrketType = {
    title: TStringTranslation;
    description?: TStringTranslation;
    symbols: SymbolType[]
}

type MarketType = {
    icon: string;
    title: TStringTranslation;
    description?: TStringTranslation;
    submarkets: SubmrketType[];
}

type IInstrumentsType = {
    title: TStringTranslation;
    active_symbols: MarketType[]
}

export default Instruments;
