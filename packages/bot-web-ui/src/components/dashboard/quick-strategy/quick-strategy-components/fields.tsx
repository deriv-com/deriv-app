import React from 'react';
import { useFormikContext } from 'formik';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import {
    TDataFields,
    TDropdownItems,
    TDropdownLists,
    TInitialValues,
    TInputsFieldNames,
    TSelectedValues,
    TSelectedValuesSelect,
    TSelectsFieldNames,
    TSymbolItem,
} from '../quick-strategy.types';
import { handleConditionsOfInput } from './data/schema-validation';
import strategies from './data/strategies-config';
import MarketOption from './market-option';
import TradeTypeOption from './trade-type-option';
import { Description, DurationFields, InputField, SelectField } from '.';

const GetFields = observer(({ data_fields_group_wise }: { data_fields_group_wise: TDataFields[] }) => {
    const { values, errors, setFieldValue, handleChange, touched } =
        useFormikContext<Record<Partial<keyof TInitialValues>, unknown>>();
    const { ui } = useStore();
    const { setCurrentFocus } = ui;
    const { quick_strategy } = useDBotStore();
    const {
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        onScrollStopDropdownList,
        selected_trade_type,
        selected_symbol,
        types_strategies_dropdown,
        duration_unit_dropdown,
        symbol_dropdown,
        trade_type_dropdown,
        selected_duration_unit,
        selected_type_strategy,
    } = quick_strategy;

    const symbol_dropdown_options = React.useMemo(
        () =>
            symbol_dropdown.map((symbol: TSymbolItem) => ({
                component: <MarketOption key={symbol.text} symbol={symbol} />,
                ...symbol,
            })),
        [symbol_dropdown]
    );

    const trade_type_dropdown_options = React.useMemo(
        () =>
            trade_type_dropdown.map(trade_type => ({
                component: <TradeTypeOption key={trade_type.text} trade_type={trade_type} />,
                ...trade_type,
            })),
        [trade_type_dropdown]
    );

    return (
        <React.Fragment>
            {data_fields_group_wise.map(item => {
                const {
                    id,
                    field_name,
                    className,
                    input_value,
                    select_value,
                    label,
                    placeholder,
                    trailing_icon_message,
                    is_able_disabled,
                    description,
                    type,
                    conditions,
                } = item;

                const is_input_field = type === 'text' || type === 'number';
                const is_select_field = type === 'select';

                const dropdown_lists: TDropdownLists = {
                    symbol: symbol_dropdown_options,
                    'trade-type': trade_type_dropdown_options,
                    'duration-unit': duration_unit_dropdown,
                    'type-strategy': types_strategies_dropdown,
                };

                const selected_values: TSelectedValues = {
                    symbol: selected_symbol,
                    'trade-type': selected_trade_type,
                    'duration-unit': selected_duration_unit,
                    'type-strategy': selected_type_strategy,
                };

                const dropdown_list = dropdown_lists[id as TDropdownItems];

                const selected_value: Partial<TSelectedValuesSelect> = selected_values[id as TDropdownItems];

                return (
                    <React.Fragment key={id}>
                        {(!conditions?.length || handleConditionsOfInput(conditions, values as TInitialValues)) && (
                            <>
                                {id === 'duration-unit' && (
                                    <DurationFields
                                        id={id}
                                        field_name={field_name as TSelectsFieldNames}
                                        dropdown_list={dropdown_list}
                                        selected_value={selected_value}
                                        label={label as string}
                                        select_value={select_value as TDropdownItems}
                                        setFieldValue={setFieldValue}
                                        className={className}
                                        is_able_disabled={is_able_disabled}
                                        values={values as TInitialValues}
                                        onChangeDropdownItem={onChangeDropdownItem}
                                        onHideDropdownList={onHideDropdownList}
                                        onScrollStopDropdownList={onScrollStopDropdownList}
                                        selected_trade_type={selected_trade_type}
                                        selected_symbol={selected_symbol}
                                    />
                                )}
                                {is_input_field && (
                                    <InputField
                                        handleChange={(e: React.ChangeEvent) => {
                                            handleChange(e);
                                        }}
                                        onChangeInputValue={onChangeInputValue}
                                        setCurrentFocus={setCurrentFocus}
                                        field_name={field_name as TInputsFieldNames}
                                        id={id}
                                        className={className}
                                        label={label}
                                        input_value={input_value}
                                        placeholder={placeholder}
                                        trailing_icon_message={trailing_icon_message}
                                        errors={touched?.[field_name as TInputsFieldNames] && errors}
                                        type={type}
                                    />
                                )}
                                {is_select_field && id !== 'duration-unit' && (
                                    <SelectField
                                        field_name={field_name as TSelectsFieldNames}
                                        id={id}
                                        dropdown_list={dropdown_list}
                                        selected_value={selected_value}
                                        label={label as string}
                                        select_value={select_value as TDropdownItems}
                                        setFieldValue={setFieldValue}
                                        className={className}
                                        is_able_disabled={is_able_disabled}
                                        values={values as TInitialValues}
                                        onChangeDropdownItem={onChangeDropdownItem}
                                        onHideDropdownList={onHideDropdownList}
                                        onScrollStopDropdownList={onScrollStopDropdownList}
                                        selected_trade_type={selected_trade_type}
                                        selected_symbol={selected_symbol}
                                    />
                                )}

                                <Description key={description} description={description} />
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
});

const QuickStrategyFields = observer(() => {
    const { quick_strategy } = useDBotStore();
    const { selected_type_strategy, selected_symbol } = quick_strategy;

    const data_fields = React.useMemo(() => {
        return selected_type_strategy.value
            ? strategies[selected_type_strategy.value as keyof typeof strategies].fields
            : [];
    }, [selected_type_strategy, selected_symbol]);

    return (
        <div className='quick-strategy__fields'>
            <GetFields data_fields_group_wise={data_fields} />
        </div>
    );
});

QuickStrategyFields.displayName = 'QuickStrategyFields';

export default QuickStrategyFields;
