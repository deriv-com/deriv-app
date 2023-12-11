import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, useFormikContext } from 'formik';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { Autocomplete, Icon, Text } from '@deriv/components';
import { TItem } from '@deriv/components/src/components/dropdown-list';
import { useDBotStore } from 'Stores/useDBotStore';
import { useStore } from '@deriv/stores';
import { TFormData } from '../types';
import { Analytics } from '@deriv/analytics';

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
    const {
        ui: { is_mobile, is_desktop },
    } = useStore();
    const { setValue } = quick_strategy;
    const [active_symbols, setActiveSymbols] = React.useState([]);
    const [is_input_started, setIsInputStarted] = useState(false);
    const [input_value, setInputValue] = useState({ text: '', value: '' });
    const { setFieldValue, values } = useFormikContext<TFormData>();

    const sendAssetValueToRudderStack = (item: string) => {
        Analytics.trackEvent('ce_bot_quick_strategy_form', {
            action: 'choose_asset',
            asset_type: item,
            form_source: 'ce_bot_quick_strategy_form',
        });
    };

    useEffect(() => {
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

    const symbols = useMemo(
        () =>
            active_symbols.map((symbol: TSymbol) => ({
                component: <MarketOption key={symbol.text} symbol={symbol} />,
                ...symbol,
            })),
        [active_symbols]
    );

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
        if (item) {
            const { value } = item as TSymbol;
            sendAssetValueToRudderStack(item.text);
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
                setIsInputStarted(false);
            }
        }
    };

    return (
        <div className={classNames('qs__form__field', { 'full-width': fullWidth })}>
            <Field name='symbol' key='asset' id='asset'>
                {({ field: { value, ...rest_field } }: FieldProps) => (
                    <>
                        <Autocomplete
                            {...rest_field}
                            readOnly={is_mobile}
                            inputMode='none'
                            data-testid='qs_autocomplete_symbol'
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
