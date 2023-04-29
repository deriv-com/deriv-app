import React, { useState } from 'react';
import { Dropdown, Autocomplete, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const items = [{ text: 'Derived' }, { text: 'Forex' }, { text: 'Stock Indices' }, { text: 'Commodities' }];

const Blocks: React.FC = () => {
    const [selected, setSelected] = React.useState(items[0].text);

    return (
        <div className='bot-builder__container'>
            <Text>{localize('1. Trade parameters:')}</Text>
            <div className='bot-builder__item'>
                <Text>{localize('Market:')}</Text>
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize(selected)}
                    list_items={items}
                    onItemSelection={({ text }) => {
                        setSelected(text);
                    }}
                />
                <Text>&nbsp;&#9658;&nbsp;</Text>
                {/* &gt; */}
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize(selected)}
                    list_items={items}
                    onItemSelection={({ text }) => {
                        setSelected(text);
                    }}
                />
                <Text>&nbsp;&#9658;&nbsp;</Text>
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize(selected)}
                    list_items={items}
                    onItemSelection={({ text }) => {
                        setSelected(text);
                    }}
                />
            </div>
            <div className='bot-builder__item'>
                <Text>{localize('Trade type:')}</Text>
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize(selected)}
                    list_items={items}
                    onItemSelection={({ text }) => {
                        setSelected(text);
                    }}
                />
                <Text>&nbsp;&#9658;&nbsp;</Text>
                {/* &gt; */}
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize(selected)}
                    list_items={items}
                    onItemSelection={({ text }) => {
                        setSelected(text);
                    }}
                />
            </div>
            <div className='bot-builder__item'>
                <Text>{localize('Contract type:')}</Text>
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize(selected)}
                    list_items={items}
                    onItemSelection={({ text }) => {
                        setSelected(text);
                    }}
                />
            </div>
        </div>
    );
};

export default Blocks;
