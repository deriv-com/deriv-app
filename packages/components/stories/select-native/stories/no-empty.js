import React from 'react';
import SelectNative from 'Components/select-native';
import Wrapper from '../wrapper';
import items from '../items';

const BasicDelect = () => {
    const [default_value, setDefaultValue] = React.useState('');

    return (
        <Wrapper>
            <SelectNative
                placeholder='Please select'
                name='dropdown'
                label='Dropdown Label'
                list_items={items}
                value={default_value}
                onChange={e => setDefaultValue(e.target.value)}
                should_show_empty_option={false}
            />
        </Wrapper>
    );
};

export default BasicDelect;
