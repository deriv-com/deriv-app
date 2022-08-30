import { Field, ErrorMessage } from 'formik';
import React from 'react';
import { Autocomplete, SelectNative, Icon, Input, Popover, IconTradeTypes, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { data_fields } from '.';

const QStrategyFields = ({
    is_mobile,
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
}: any) => {
    const fields = data_fields.map((item, idx) => {
        const {
            index,
            id,
            name,
            field_name,
            className,
            label_className,
            field_className,
            input_value,
            label,
            placeholder,
            trailing_icon_message,
            zIndex,
            is_able_disabled,
        } = item;

        const isInputField = input_value.startsWith('input_');

        const getDropdownList = name.endsWith('types-strategies')
            ? types_strategies_dropdown
            : name.endsWith('symbol')
            ? symbol_dropdown
            : name.endsWith('trade-type')
            ? trade_type_dropdown
            : name.endsWith('duration-unit')
            ? duration_unit_dropdown
            : '';

        const getSelectedValue = name.endsWith('types-strategies')
            ? selected_type_strategy
            : name.endsWith('symbol')
            ? selected_symbol
            : name.endsWith('trade-type')
            ? selected_trade_type
            : name.endsWith('duration-unit')
            ? selected_duration_unit
            : '';

        const isBaseField = name.startsWith('base__');
        const isUniqField = index === selected_type_strategy.index;

        return (
            <Field name={isBaseField ? field_name : isUniqField ? field_name : ''} key={id}>
                {({ field }) => {
                    return isBaseField ? (
                        <>
                            {isInputField ? (
                                <Input
                                    {...field}
                                    className={className}
                                    label_className={label_className}
                                    field_className={field_className}
                                    type='text'
                                    label={localize(label)}
                                    onChange={e => {
                                        handleChange(e);
                                        onChangeInputValue(input_value, e);
                                    }}
                                    onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                    onBlur={() => setCurrentFocus(null)}
                                    placeholder={placeholder}
                                    trailing_icon={
                                        <Popover
                                            alignment={is_mobile ? 'top' : 'bottom'}
                                            message={localize(trailing_icon_message)}
                                            zIndex={zIndex}
                                        >
                                            <Icon icon='IcInfoOutline' />
                                        </Popover>
                                    }
                                />
                            ) : is_mobile ? (
                                <SelectNative
                                    list_items={getDropdownList}
                                    value={getSelectedValue.value}
                                    label={localize(label)}
                                    should_show_empty_option={false}
                                    onChange={e => {
                                        onChangeDropdownItem(input_value, e.target.value, setFieldValue);
                                    }}
                                />
                            ) : (
                                <Autocomplete
                                    {...field}
                                    autoComplete='off'
                                    className={className}
                                    type='text'
                                    label={localize(label)}
                                    list_items={getDropdownList}
                                    disabled={is_able_disabled && getDropdownList?.length === 1}
                                    onHideDropdownList={() => {
                                        onHideDropdownList(input_value, values[field.name], setFieldValue);
                                    }}
                                    onItemSelection={({ value }) => {
                                        onChangeDropdownItem(input_value, value, setFieldValue);
                                    }}
                                    onScrollStop={() => onScrollStopDropdownList(input_value)}
                                    leading_icon={
                                        (input_value === 'trade-type' && selected_trade_type?.icon && (
                                            <Text>
                                                <IconTradeTypes type={selected_trade_type.icon[0]} />
                                                <IconTradeTypes type={selected_trade_type.icon[1]} />
                                            </Text>
                                        )) ||
                                        (input_value === 'symbol' && selected_symbol?.value && (
                                            <Icon icon={`IcUnderlying${selected_symbol.value}`} size={24} />
                                        ))
                                    }
                                />
                            )}
                            {name.endsWith('types-strategies') && (
                                <div className='q-strategy__description'>{description}</div>
                            )}
                        </>
                    ) : (
                        isUniqField && (
                            <Input
                                {...field}
                                className={className}
                                label_className={label_className}
                                field_className={field_className}
                                type='text'
                                label={localize(label)}
                                onChange={e => {
                                    handleChange(e);
                                    onChangeInputValue(input_value, e);
                                }}
                                onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                onBlur={() => setCurrentFocus(null)}
                                placeholder={placeholder}
                                trailing_icon={
                                    <Popover
                                        alignment={is_mobile ? 'top' : 'bottom'}
                                        message={localize(trailing_icon_message)}
                                        zIndex={zIndex}
                                    >
                                        <Icon icon='IcInfoOutline' />
                                    </Popover>
                                }
                            />
                        )
                    );
                }}
            </Field>
        );
    });

    return <>{fields}</>;
};

export default QStrategyFields;
