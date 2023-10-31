import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, Icon, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useDBotStore } from 'Stores/useDBotStore';
import { TFormData } from '../types';

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
    <div key={symbol.value} className='qs__select__option'>
        <Icon data_testid='dt_symbol_icon' icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='qs__select__option__text' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

type TSymbolSelect = {
    fullWidth?: boolean;
};

const SymbolSelect: React.FC<TSymbolSelect> = ({ fullWidth = false }) => {
    const { quick_strategy } = useDBotStore();
    const { setValue } = quick_strategy;
    const [active_symbols, setActiveSymbols] = React.useState([]);
    const { setFieldValue, values } = useFormikContext<TFormData>();

    React.useEffect(() => {
        const { active_symbols } = ApiHelpers.instance;
        const symbols = active_symbols.getSymbolsForBot();
        setActiveSymbols(symbols);

        if (values?.symbol) {
            const has_symbol = !!symbols.find((symbol: { [key: string]: string }) => symbol.value === values.symbol);
            if (!has_symbol) {
                setFieldValue('symbol', symbols?.[0]?.value);
                setValue('symbol', symbols?.[0]?.value);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const symbols = React.useMemo(
        () =>
            active_symbols.map((symbol: TSymbol) => ({
                component: <MarketOption key={symbol.text} symbol={symbol} />,
                ...symbol,
            })),
        [active_symbols]
    );

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullWidth })}>
            <Field name='symbol' key='asset' id='asset'>
                {({ field: { value, ...rest_field } }: FieldProps) => {
                    const selected_symbol = symbols.find(symbol => symbol.value === value);
                    return (
                        <>
                            <Autocomplete
                                {...rest_field}
                                inputMode='none'
                                data-testid='qs_autocomplete_symbol'
                                autoComplete='off'
                                className='qs__autocomplete'
                                value={selected_symbol?.text || ''}
                                list_items={symbols}
                                onItemSelection={(item: TItem) => {
                                    if (item?.value) {
                                        setFieldValue?.('symbol', (item as TSymbol)?.value as string);
                                        setValue('symbol', (item as TSymbol)?.value as string);
                                    }
                                }}
                                leading_icon={<Icon icon={`IcUnderlying${selected_symbol?.value}`} size={24} />}
                            />
                        </>
                    );
                }}
            </Field>
        </div>
    );
};

export default SymbolSelect;
