import React from 'react';
import { Autocomplete, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';

const items = [{ text: 'Derived' }, { text: 'Forex' }, { text: 'Stock Indices' }, { text: 'Commodities' }];

const Blocks: React.FC = () => {
    const [selected, setSelected] = React.useState('');
    const {
        blocks: { markets_dropdown, loadDataStrategy, exportStrategyToJson },
    } = useDBotStore();

    React.useEffect(() => {
        loadDataStrategy();
    }, []);

    return (
        <div className='bot-builder__container'>
            <button type='button' onClick={() => exportStrategyToJson(items)}>
                Export Data
            </button>
            <Text>{localize('1. Trade parameters:')}</Text>
            <div className='bot-builder__item'>
                <Text>{localize('Market:')}</Text>
                <Autocomplete
                    autoComplete='off'
                    className='quick-strategy__dropdown quick-strategy__leading'
                    type='text'
                    label={localize(selected)}
                    list_items={markets_dropdown}
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
                    // label={localize(selected)}
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
                    // label={localize(selected)}
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
                    // label={localize(selected)}
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
                    // label={localize(selected)}
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
                    // label={localize(selected)}
                    list_items={items}
                    onItemSelection={({ text }) => {
                        setSelected(text);
                    }}
                />
            </div>
        </div>
    );
};

export default observer(Blocks);
