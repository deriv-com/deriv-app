import React from 'react';
import { Inputs, Description, Selects, DurationFields, data_fields, data_uniq_input_obj } from '.';
import { TDropdownItems, TDropdowns, TSelectedValuesSelect } from '../quick-strategy.types';
import { TDropdownLists, TQuickStrategyFields, TSelectedValues } from './components.types';

const QuickStrategyFields = React.memo(
    ({
        types_strategies_dropdown,
        symbol_dropdown,
        trade_type_dropdown,
        duration_unit_dropdown,
        selected_type_strategy,
        selected_trade_type,
        selected_symbol,
        selected_duration_unit,
        onChangeDropdownItem,
        onHideDropdownList,
        setFieldValue,
        onScrollStopDropdownList,
        handleChange,
        onChangeInputValue,
        setCurrentFocus,
        values,
        description,
        errors,
    }: TQuickStrategyFields) => {
        const uniq_selected_input = React.useMemo(
            () => data_uniq_input_obj.filter((_elem, index) => index === selected_type_strategy.index)[0],
            [selected_type_strategy]
        );

        const dropdown_lists: TDropdownLists = {
            symbol: symbol_dropdown,
            'trade-type': trade_type_dropdown,
            'duration-unit': duration_unit_dropdown,
            'type-strategy': types_strategies_dropdown,
        };

        const selected_values: TSelectedValues = {
            symbol: selected_symbol,
            'trade-type': selected_trade_type,
            'duration-unit': selected_duration_unit,
            'type-strategy': selected_type_strategy,
        };

        const fields = React.useMemo(
            () => {
                return data_fields.map((item, idx) => {
                    const {
                        id,
                        field_name,
                        className,
                        input_value,
                        select_value,
                        label,
                        placeholder,
                        trailing_icon_message,
                        zIndex,
                        is_able_disabled,
                    } = item;

                    const is_uniq_strategy_field = item?.is_uniq_strategy_field;
                    const is_input_field = is_uniq_strategy_field || !!input_value;
                    const is_select_field = !!select_value;

                    const dropdown_list: TDropdowns = !is_uniq_strategy_field
                        ? dropdown_lists[id as TDropdownItems]
                        : [];

                    const selected_value: Partial<TSelectedValuesSelect> = !is_uniq_strategy_field
                        ? selected_values[id as TDropdownItems]
                        : {};

                    return (
                        <React.Fragment key={id}>
                            {id === 'duration-unit' && (
                                <DurationFields
                                    id={id}
                                    field_name={field_name}
                                    idx={idx}
                                    dropdown_list={dropdown_list}
                                    selected_value={selected_value}
                                    label={label}
                                    select_value={select_value}
                                    setFieldValue={setFieldValue}
                                    className={className}
                                    is_able_disabled={is_able_disabled}
                                    values={values}
                                    onChangeDropdownItem={onChangeDropdownItem}
                                    onHideDropdownList={onHideDropdownList}
                                    onScrollStopDropdownList={onScrollStopDropdownList}
                                    selected_trade_type={selected_trade_type}
                                    selected_symbol={selected_symbol}
                                    handleChange={handleChange}
                                    onChangeInputValue={onChangeInputValue}
                                    setCurrentFocus={setCurrentFocus}
                                    errors={errors}
                                />
                            )}
                            {is_input_field && (
                                <Inputs
                                    idx={idx}
                                    handleChange={handleChange}
                                    onChangeInputValue={onChangeInputValue}
                                    setCurrentFocus={setCurrentFocus}
                                    field_name={field_name}
                                    id={id}
                                    className={className}
                                    label={label}
                                    input_value={input_value}
                                    placeholder={placeholder}
                                    is_uniq_strategy_field={is_uniq_strategy_field}
                                    trailing_icon_message={trailing_icon_message}
                                    zIndex={zIndex}
                                    uniq_selected_input={uniq_selected_input}
                                    errors={errors}
                                    is_input_field={is_input_field}
                                />
                            )}
                            {is_select_field && id !== 'duration-unit' && (
                                <Selects
                                    field_name={field_name}
                                    id={id}
                                    dropdown_list={dropdown_list}
                                    selected_value={selected_value}
                                    label={label}
                                    select_value={select_value}
                                    setFieldValue={setFieldValue}
                                    className={className}
                                    is_able_disabled={is_able_disabled}
                                    values={values}
                                    onChangeDropdownItem={onChangeDropdownItem}
                                    onHideDropdownList={onHideDropdownList}
                                    onScrollStopDropdownList={onScrollStopDropdownList}
                                    selected_trade_type={selected_trade_type}
                                    selected_symbol={selected_symbol}
                                    is_input_field={is_input_field}
                                />
                            )}
                            <Description key={description} id={id} description={description} />
                        </React.Fragment>
                    );
                });
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [
                types_strategies_dropdown,
                symbol_dropdown,
                trade_type_dropdown,
                duration_unit_dropdown,
                selected_type_strategy,
                selected_trade_type,
                selected_symbol,
                selected_duration_unit,
                errors,
            ]
        );

        return <div className='quick-strategy__fields'>{fields}</div>;
    },
    (prevProps, nextProps) =>
        prevProps.values === nextProps.values &&
        prevProps.errors === nextProps.errors &&
        prevProps.duration_unit_dropdown === nextProps.duration_unit_dropdown
);

QuickStrategyFields.displayName = 'QuickStrategyFields';

export default QuickStrategyFields;
