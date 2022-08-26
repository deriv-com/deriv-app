import { Field, ErrorMessage } from 'formik';
import React from 'react';
import { Autocomplete, SelectNative, Icon, Input, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { data_fields } from '.';

const QStrategyFields = ({
    is_mobile,
    types_strategies_dropdown,
    selected_type_strategy,
    onChangeDropdownItem,
    onHideDropdownList,
    setFieldValue,
    onScrollStopDropdownList,
    handleChange,
    onChangeInputValue,
    setCurrentFocus,
}: any) => {
    const is_input = true; //!remove later

    const fields = data_fields.map((item, idx) => {
        const {
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
        } = item;

        return (
            <Field name={field_name} key={id}>
                {({ field }) => (
                    <>
                        {is_input ? (
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
                                list_items={types_strategies_dropdown}
                                value={selected_type_strategy.value}
                                // label={localize('Asset')}
                                should_show_empty_option={false}
                                onChange={e => {
                                    onChangeDropdownItem('type-strategy', e.target.value, setFieldValue);
                                }}
                            />
                        ) : (
                            <Autocomplete
                                {...field}
                                autoComplete='off'
                                // className='quick-strategy__dropdown quick-strategy__leading'
                                type='text'
                                // label={localize('Asset')}
                                list_items={types_strategies_dropdown}
                                disabled={types_strategies_dropdown?.length === 1} //?
                                onHideDropdownList={() => {
                                    onHideDropdownList('type-strategy', values[field.name], setFieldValue);
                                }}
                                onItemSelection={({ value }) => {
                                    onChangeDropdownItem('type-strategy', value, setFieldValue);
                                }}
                                onScrollStop={() => onScrollStopDropdownList('type-strategy')}
                            />
                        )}
                    </>
                )}
            </Field>
        );
    });

    return <>{fields}</>;
};

export default QStrategyFields;
