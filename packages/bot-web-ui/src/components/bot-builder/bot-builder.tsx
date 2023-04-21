import React, { useState } from 'react';
import { Dropdown, Autocomplete, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const items = [
    { text: 'Derived' },
    { text: 'Forex' },
    { text: 'Stock Indices' },
    { text: 'Commodities' }
];

const BotBuilder: React.FC = () => {

const [selected, setSelected] = useState(items[0].text);
console.log('selected', selected);

    return (
        <div className='bot-builder__container'>
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
    );
};

export default BotBuilder;