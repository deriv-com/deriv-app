import React from 'react';
import { Autocomplete, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Field } from 'formik';

const BlocksFields = ({
    selected_market,
    markets_dropdown,
    setSelectedMarket,
    selected_submarket,
    submarkets_dropdown,
    setSelectedSubmarket,
    values,
    setFieldValue,
    onHideDropdownList,
}: any) => {
return(<>
    <div className='bot-builder__item'>
        <Text>{localize('Market:')}</Text>
        <Field name={'bot-builder__market'} key={0} id={0}>
            {({ field }: any) => (
                <Autocomplete
                    {...field}
                    autoComplete='off'
                    className={'quick-strategy__dropdown quick-strategy__leading'}
                    type='text'
                    label={localize('Markets')}
                    list_items={markets_dropdown}
                    disabled={markets_dropdown?.length === 1}
                    onHideDropdownList={() => {
                         console.log('values[field.name]', values[field.name], values)
                        onHideDropdownList(
                            'market',
                            values[field.name],
                            setFieldValue
                        );
                    }}
                    // onItemSelection={({ value }: { value: string }) => {
                    //     onChangeDropdownItem(select_value, value, setFieldValue);
                    // }}
                    onItemSelection={(selected_item) => {
                        setSelectedMarket(selected_item);
                    }}
                    // onScrollStop={() => onScrollStopDropdownList(select_value)}
                    />
            )}
        </Field>
        <Text>&nbsp;&#9658;&nbsp;</Text>
        <Field name={'bot-builder__submarket'} key={1} id={1}>
            {({ field }: any) => (
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize('Submarkets')}
                    list_items={submarkets_dropdown}
                    onHideDropdownList={() => {
                        onHideDropdownList(
                            'submarket',
                            values[field.name],
                            setFieldValue
                        );
                    }}
                    onItemSelection={(selected_item) => {
                        console.log('selected_item', selected_item);
                        
                        setSelectedSubmarket(selected_item.text);
                    }}
                />
            )}
        </Field>
        <Text>&nbsp;&#9658;&nbsp;</Text>
            {/* <Autocomplete
                autoComplete='off'
                className='quick-strategy__dropdown quick-strategy__leading'
                type='text'
                label={localize(selected)}
                list_items={items}
                onItemSelection={({ text }) => {
                    setSelected(text);
                }}
            /> */}
    </div>
</>);
};

BlocksFields.displayName = 'BlocksFields';

export default BlocksFields;
