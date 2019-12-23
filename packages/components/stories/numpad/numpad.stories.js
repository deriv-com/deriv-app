import React         from 'react';
import { storiesOf } from '@storybook/react';
import Numpad        from 'Components/numpad';
import {
    boolean,
    number,
    withKnobs }      from '@storybook/addon-knobs';
import Theme         from '../shared/theme';

storiesOf('Numpad', module)
    .add(
        'Basic usage (Duration)',
        () => {
            const [value, setValue] = React.useState(0);
            return (
                <div style={{
                    padding: '24px',
                }}
                >
                    <Theme is_dark={boolean('Dark theme', false)}>
                        <Numpad
                            value={value}
                            onChange={setValue}
                            min={number('min', 100)}
                            max={number('max', 124)}
                        />
                    </Theme>
                </div>
            );
        },
    )
    .add(
        'With currencies (Amount)',
        () => {
            const [value, setValue] = React.useState(100);
            return (
                <div style={{
                    padding: '24px',
                }}
                >
                    <Theme is_dark={boolean('Dark theme', false)}>
                        <Numpad
                            value={value}
                            onChange={setValue}
                            is_currency
                            pip_size={2}
                            currency='USD'
                            min={number('min', 100)}
                            max={number('max', 124)}
                        />
                    </Theme>
                </div>
            );
        },
    )
    .addDecorator(withKnobs);
