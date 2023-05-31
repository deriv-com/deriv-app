import React from 'react';
import { Autocomplete, Text } from '@deriv/components';
import { Field } from 'formik';

const SelectBlockField = ({
    values,
    setFieldValue,
    onHideDropdownList,
    onChangeDropdownItem,
    name_field,
    label, 
    dropdown,
    select_value,
    onScrollStopDropdownList,
}: any) => {
    
return(<>
    <Field name={name_field} key={0} id={0}>
        {({ field }: any) => (
            <Autocomplete
                {...field}
                autoComplete='off'
                type='text'
                label={label}
                list_items={dropdown}
                disabled={dropdown?.length === 1}
                onHideDropdownList={() => {
                    onHideDropdownList(
                        select_value,
                        values[field.name],
                        setFieldValue
                    );
                }}
                onItemSelection={({ value }: { value: string }) => {
                    onChangeDropdownItem(select_value, value, setFieldValue);
                }}
                onScrollStop={() => onScrollStopDropdownList(select_value)}
                />
        )}
    </Field>
</>);
};

SelectBlockField.displayName = 'SelectBlockField';

export default SelectBlockField;
