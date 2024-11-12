import React, { useEffect, useMemo, useState } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, Icon, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TFormData } from '../types';

type TSymbol = {
    component?: React.ReactNode;
    text: string;
    value: string;
    group?: string;
};

type TMarketOption = {
    symbol: TSymbol;
};

const MarketOption: React.FC<TMarketOption> = ({ symbol }) => (
    <div key={symbol.value} className='qs__select__option'>
        <Icon data_testid='dt_symbol_icon' icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='qs__select__option__text' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

const SymbolSelect: React.FC = () => {
    const { quick_strategy } = useDBotStore();
    const {
        ui: { is_desktop },
    } = useStore();
    const { setValue, selected_strategy } = quick_strategy;
    const [active_symbols, setActiveSymbols] = React.useState<TSymbol[]>([]);
    const [is_input_started, setIsInputStarted] = useState(false);
    const [input_value, setInputValue] = useState({ text: '', value: '' });
    const [last_selected_symbol, setLastSelectedSymbol] = useState({ text: '', value: '' });
    const { setFieldValue, values } = useFormikContext<TFormData>();
    const ACCUMULATORS_STRATEGIES = [
        'ACCUMULATORS_DALEMBERT_WITH_TICK_COUNT_TAKE_PROFIT',
        'ACCUMULATORS_MARTINGALE_WITH_TICK_COUNT_TAKE_PROFIT',
        'ACCUMULATORS_MARTINGALE_ON_STAT_RESET_WITH_TICK_COUNT_TAKE_PROFIT',
        'ACCUMULATORS_DALEMBERT_ON_STAT_RESET_WITH_TICK_COUNT_TAKE_PROFIT',
    ];
    const is_strategy_accumulator = ACCUMULATORS_STRATEGIES.includes(selected_strategy);

    const symbols = useMemo(
        () =>
            active_symbols.map((symbol: TSymbol) => ({
                component: <MarketOption key={symbol.text} symbol={symbol} />,
                ...symbol,
            })),
        [active_symbols]
    );

    useEffect(() => {
        const { active_symbols } = ApiHelpers.instance as unknown as {
            active_symbols: {
                getSymbolsForBot: () => TSymbol[];
            };
        };
        let symbols = active_symbols.getSymbolsForBot();

        if (is_strategy_accumulator) {
            symbols = symbols.filter(symbol => symbol?.group?.startsWith('Continuous Indices'));
        }

        setActiveSymbols(symbols);

        const has_symbol = !!symbols?.find(symbol => symbol?.value === values?.symbol);
        if (!has_symbol) {
            setFieldValue('symbol', symbols?.[0]?.value);
            setValue('symbol', symbols?.[0]?.value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const selected_symbol = symbols.find(symbol => symbol.value === values.symbol);
        if (selected_symbol) {
            setInputValue({ text: selected_symbol.text, value: selected_symbol.value });
        }
    }, [symbols, values.symbol, setInputValue]);

    const handleFocus = () => {
        if (is_desktop && !is_input_started) {
            setIsInputStarted(true);
            setInputValue({ text: '', value: '' });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue({ ...input_value, text: e.target.value });
    };

    const handleItemSelection = (item: TItem) => {
        if (item?.value) {
            const { value } = item as TSymbol;
            setFieldValue('symbol', value);
            setValue('symbol', value);
            setIsInputStarted(false);
        }
    };

    const handleHideDropdownList = () => {
        if (is_desktop) {
            const selectedSymbol = symbols.find(symbol => symbol.value === values.symbol);
            if (selectedSymbol && selectedSymbol.text !== input_value.text) {
                setInputValue({ text: selectedSymbol.text, value: selectedSymbol.value });
                setLastSelectedSymbol({ text: selectedSymbol.text, value: selectedSymbol.value });
                setIsInputStarted(false);
            }
            if (!selectedSymbol) {
                setInputValue({ text: last_selected_symbol.text, value: last_selected_symbol.value });
                setIsInputStarted(false);
            }
        }
    };

    return (
        <div className='qs__form__field qs__form__field__input'>
            <Field name='symbol' key='asset' id='asset'>
                {({ field: { value, ...rest_field } }: FieldProps) => (
                    <>
                        <Autocomplete
                            {...rest_field}
                            readOnly={!is_desktop}
                            inputMode='none'
                            data-testid='dt_qs_symbol'
                            autoComplete='off'
                            className='qs__autocomplete'
                            value={input_value.text}
                            list_items={symbols}
                            onItemSelection={handleItemSelection}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onHideDropdownList={handleHideDropdownList}
                            leading_icon={<Icon icon={`IcUnderlying${input_value.value}`} size={24} />}
                        />
                    </>
                )}
            </Field>
        </div>
    );
};

export default SymbolSelect;
