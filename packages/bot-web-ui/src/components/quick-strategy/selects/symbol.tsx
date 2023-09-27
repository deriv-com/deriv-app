import React from 'react';
import { Field, FieldProps } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, Icon, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';

type TSymbol = {
    component?: React.ReactNode;
    text: string;
    value: string;
    group: string;
};

type TMarketOption = {
    symbol: TSymbol;
};

const MarketOption: React.FC<TMarketOption> = ({ symbol }) => (
    <div key={symbol.value} className='quick-strategy__option'>
        <Icon data_testid='dt_symbol_icon' icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

type TSymbolSelect = {
    value?: string;
    onChange?: ({ symbol }: { symbol: string }) => void;
};

const SymbolSelect: React.FC<TSymbolSelect> = ({ value, onChange }) => {
    const [active_symbols, setActiveSymbols] = React.useState([]);
    const [selected, setSelected] = React.useState(value);

    React.useEffect(() => {
        const { active_symbols } = ApiHelpers.instance;
        setActiveSymbols(active_symbols.getSymbolsForBot());
    }, []);

    const symbols = React.useMemo(
        () =>
            active_symbols.map((symbol: TSymbol) => ({
                component: <MarketOption key={symbol.text} symbol={symbol} />,
                ...symbol,
            })),
        [active_symbols]
    );

    const handleChange = (value: string) => {
        if (value && value !== selected) {
            setSelected(value);
            onChange?.({ symbol: value });
        }
    };

    const selected_symbol = symbols.find(symbol => symbol.value === selected);

    return (
        <div>
            <Field name='asset' key='asset' id='asset'>
                {({ field }: FieldProps<string, TFormValues>) => (
                    <>
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className='qs__autocomplete'
                            value={selected_symbol?.text || ''}
                            list_items={symbols}
                            onItemSelection={(item: TItem) => {
                                handleChange((item as TSymbol)?.value as string);
                            }}
                            leading_icon={<Icon icon={`IcUnderlying${selected_symbol?.value}`} size={24} />}
                        />
                    </>
                )}
            </Field>
        </div>
    );
};

export default SymbolSelect;
