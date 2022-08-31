import { Field } from 'formik';
import React from 'react';
import { Autocomplete, SelectNative, Icon, IconTradeTypes, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const SelectField = ({
    field_name,
    id,
    is_mobile,
    getDropdownList,
    getSelectedValue,
    label,
    input_value,
    setFieldValue,
    className,
    is_able_disabled,
    values,
    onChangeDropdownItem,
    onHideDropdownList,
    onScrollStopDropdownList,
    selected_trade_type,
    selected_symbol,
}: any) => (
    <Field name={field_name} key={id}>
        {({ field }) => {
            return (
                <>
                    {is_mobile ? (
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
                </>
            );
        }}
    </Field>
);

export default SelectField;
