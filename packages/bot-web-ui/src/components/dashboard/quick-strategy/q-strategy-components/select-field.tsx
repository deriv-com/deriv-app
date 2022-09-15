import { Field, FieldProps } from 'formik';
import React from 'react';
import { Autocomplete, SelectNative, Icon, IconTradeTypes, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TFormValues, TSelectsFieldNames } from '../q-strategy.types';
import { TSelectFieldProps } from './q-strategy-components.types';

const SelectField = React.memo(
    ({
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
    }: TSelectFieldProps) => {
        return (
            <Field name={field_name} key={id} id={id}>
                {({ field }: FieldProps<string, TFormValues>) => (
                    <>
                        {is_mobile ? (
                            <SelectNative
                                list_items={getDropdownList}
                                value={typeof getSelectedValue === 'string' ? getSelectedValue : getSelectedValue.value}
                                label={localize(label)}
                                should_show_empty_option={false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                                    onHideDropdownList(
                                        input_value,
                                        values[field.name] as TSelectsFieldNames,
                                        setFieldValue
                                    );
                                }}
                                onItemSelection={({ value }: { value: string }) => {
                                    onChangeDropdownItem(input_value, value, setFieldValue);
                                }}
                                onScrollStop={() => onScrollStopDropdownList(input_value)}
                                leading_icon={
                                    (input_value === 'trade-type' && selected_trade_type?.icon && (
                                        <Text>
                                            <IconTradeTypes type={selected_trade_type?.icon[0]} />
                                            <IconTradeTypes type={selected_trade_type?.icon[1]} />
                                        </Text>
                                    )) ||
                                    (input_value === 'symbol' && (selected_symbol?.value as string) && (
                                        <Icon icon={`IcUnderlying${selected_symbol?.value}`} size={24} />
                                    ))
                                }
                            />
                        )}
                    </>
                )}
            </Field>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.getDropdownList === nextProps.getDropdownList &&
            prevProps.getSelectedValue === nextProps.getSelectedValue
        );
    }
);
SelectField.displayName = 'SelectField';

export default SelectField;
