import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { SelectBlockField } from '.';

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
    onChangeDropdownItem,
    selected_symbol,
    setSelectedSymbol,
    symbols_dropdown,
    onScrollStopDropdownList,
}: any) => {
    
return(<>
    <div className='bot-builder__item'>
        <Text>{localize('Market:')}</Text>
        <SelectBlockField
            selected={selected_market}
            setSelected={setSelectedMarket}//
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__market'}
            label={localize('Markets')}
            dropdown={markets_dropdown}
            select_value={localize('market')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
        <Text>&nbsp;&#9658;&nbsp;</Text>
        <SelectBlockField
            selected={selected_submarket}
            setSelected={setSelectedSubmarket}//
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__submarket'}
            label={localize('Submarkets')}
            dropdown={submarkets_dropdown}
            select_value={localize('submarket')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
        <Text>&nbsp;&#9658;&nbsp;</Text>
        <SelectBlockField
            selected={selected_symbol}
            setSelected={setSelectedSymbol}//
            values={values}
            setFieldValue={setFieldValue}
            onHideDropdownList={onHideDropdownList}
            onChangeDropdownItem={onChangeDropdownItem}
            name_field={'bot-builder__symbol'}
            label={localize('Symbols')}
            dropdown={symbols_dropdown}
            select_value={localize('symbol')}
            onScrollStopDropdownList={onScrollStopDropdownList}
        />
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
