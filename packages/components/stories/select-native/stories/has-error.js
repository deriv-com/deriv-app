import React from 'react';
import SelectNative from 'Components/select-native';
import Wrapper from '../wrapper';
import items from '../items';

const BasicDelect = () => {
    const [default_value, setDefaultValue] = React.useState('');

    return (
        <React.Fragment>
            <Wrapper>
                <SelectNative
                    placeholder='Please select'
                    name='dropdown'
                    label='Dropdown Label'
                    list_items={items}
                    value={default_value}
                    onChange={e => setDefaultValue(e.target.value)}
                    error='Error message'
                />
            </Wrapper>
            <Wrapper is_dark>
                <SelectNative
                    placeholder='Please select'
                    name='dropdown'
                    label='Dropdown Label'
                    list_items={items}
                    value={default_value}
                    onChange={e => setDefaultValue(e.target.value)}
                    error='Error message'
                />
            </Wrapper>
        </React.Fragment>
    );
};

export default BasicDelect;
