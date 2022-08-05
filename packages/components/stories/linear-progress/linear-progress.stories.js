import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wrapper from '../shared/wrapper';
import LinearProgress from 'Components/linear-progress';
import React from 'react';
import notes from './README.md';

storiesOf('LinearProgress', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <LinearProgress
                        timeout={5000}
                        action={() => {}}
                        render={remaining => {
                            return <p>{remaining}</p>;
                        }}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
