import { storiesOf } from '@storybook/react';
import Counter from 'Components/counter';
import React from 'react';
import notes from './README.md';
import './counter.stories.scss';

storiesOf('Counter', module).add(
    'Main function',
    () => {
        return (
            <React.Fragment>
                <div className={'counter__wrapper'}>
                    <Counter count={5} className='counter' />
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
