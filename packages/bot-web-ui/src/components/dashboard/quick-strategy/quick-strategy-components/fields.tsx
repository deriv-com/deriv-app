import React from 'react';
import { useFormikContext } from 'formik';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { TDropdownItems, TSelectedValuesSelect, TSymbolItem } from '../quick-strategy.types';
import { handleConditionsOfInput } from './data/schema-validation';
import strategies from './data/strategies-config';
import { TDropdownLists, TQuickStrategyFields, TSelectedValues } from './components.types';
import MarketOption from './market-option';
import TradeTypeOption from './trade-type-option';
import { Description, DurationFields, InputField, SelectField } from '.';

const Get_Fields = observer(({ data_fields_group_wise }) => {
    const { values, errors, setFieldValue, handleChange, touched } = useFormikContext();
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

    return data_fields_group_wise.map(item => {
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
            description,
            conditions,
            type,
        } = item;

        const is_input_field = type === 'text' || type === 'number';
        const is_select_field = type === 'select';

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
                {(!conditions?.length || handleConditionsOfInput(conditions, values)) && (
                    <>
                        {id === 'duration-unit' && (
                            <DurationFields
                                id={id}
                                field_name={field_name}
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
                                handleChange={e => {
                                    handleChange(e);
                                }}
                                onChangeInputValue={onChangeInputValue}
                                setCurrentFocus={setCurrentFocus}
                                errors={errors}
                            />
                        )}
                        {is_input_field && (
                            <InputField
                                handleChange={e => {
                                    handleChange(e);
                                }}
                                onChangeInputValue={onChangeInputValue}
                                setCurrentFocus={setCurrentFocus}
                                field_name={field_name}
                                id={id}
                                className={className}
                                label={label}
                                input_value={input_value}
                                placeholder={placeholder}
                                trailing_icon_message={trailing_icon_message}
                                zIndex={zIndex}
                                errors={touched?.[field_name] && errors}
                                type={type}
                            />
                        )}
                        {is_select_field && id !== 'duration-unit' && (
                            <SelectField
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
                            />
                        )}

                        <Description key={description} id={id} description={description} />
                    </>
                )}
            </React.Fragment>
        );
    });
});

const QuickStrategyFields = observer(() => {
    const { quick_strategy } = useDBotStore();
    const { selected_type_strategy, selected_symbol } = quick_strategy;

    const data_fields = React.useMemo(() => {
        return selected_type_strategy.value ? strategies[selected_type_strategy.value].fields : [];
    }, [selected_type_strategy, selected_symbol]);

    return (
        <div className='quick-strategy__fields'>
            <Get_Fields data_fields_group_wise={data_fields} />
        </div>
    );
});

QuickStrategyFields.displayName = 'QuickStrategyFields';

export default QuickStrategyFields;
