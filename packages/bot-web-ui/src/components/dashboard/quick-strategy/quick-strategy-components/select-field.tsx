import React from 'react';
import { Field, FieldProps } from 'formik';
import { Autocomplete, Icon, IconTradeTypes, SelectNative, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TFormValues, TSelectsFieldNames } from '../quick-strategy.types';
import { TSelectFieldProps } from './components.types';

const SelectField = React.memo(
    ({
        field_name,
        id,
        is_mobile,
        dropdown_list,
        selected_value,
        label,
        select_value,
        setFieldValue,
        className,
        is_able_disabled,
        values,
        onChangeDropdownItem,
        onHideDropdownList,
        onScrollStopDropdownList,
        selected_trade_type,
        selected_symbol,
    }: TSelectFieldProps) => (
        <Field name={field_name} key={id} id={id}>
            {({ field }: FieldProps<string, TFormValues>) => (
                <>
                    {is_mobile ? (
                        <SelectNative
                            list_items={dropdown_list}
                            value={typeof selected_value === 'string' ? selected_value : selected_value.value}
                            label={localize(label)}
                            should_show_empty_option={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                onChangeDropdownItem(select_value, e.target.value, setFieldValue);
                            }}
                        />
                    ) : (
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className={className}
                            type='text'
                            label={localize(label)}
                            list_items={dropdown_list}
                            disabled={is_able_disabled && dropdown_list?.length === 1}
                            onHideDropdownList={() => {
                                onHideDropdownList(
                                    select_value,
                                    values[field.name] as TSelectsFieldNames,
                                    setFieldValue
                                );
                            }}
                            onItemSelection={({ value }: { value: string }) => {
                                onChangeDropdownItem(select_value, value, setFieldValue);
                            }}
                            onScrollStop={() => onScrollStopDropdownList(select_value)}
                            leading_icon={
                                (select_value === 'trade-type' && selected_trade_type?.icon && (
                                    <Text>
                                        <IconTradeTypes type={selected_trade_type?.icon[0]} />
                                        <IconTradeTypes type={selected_trade_type?.icon[1]} />
                                    </Text>
                                )) ||
                                (select_value === 'symbol' && (selected_symbol?.value as string) && (
                                    <Icon icon={`IcUnderlying${selected_symbol?.value}`} size={24} />
                                ))
                            }
                        />
                    )}
                </>
            )}
        </Field>
    ),
    (prevProps, nextProps) => {
        return (
            prevProps.dropdown_list === nextProps.dropdown_list && prevProps.selected_value === nextProps.selected_value
        );
    }
);
SelectField.displayName = 'SelectField';

export default SelectField;
