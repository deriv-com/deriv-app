import { storiesOf } from '@storybook/react';
import Checkbox from 'Components/checkbox';
import React, { useState } from 'react';
import notes from './README.md';
import './checkbox.stories.scss';

storiesOf('CheckBox', module).add(
    'Main function',
    () => {
        const [selected, setSelected] = useState(false);

        return (
            <React.Fragment>
                <div className={'checkbox__wrapper'}>
                    <Checkbox
                        name='test_checkbox'
                        value={selected}
                        onChange={() => setSelected(!selected)}
                        label={'This is a test checkbox'}
                    />
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
