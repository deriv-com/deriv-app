import React         from 'react';
import { action }    from '@storybook/addon-actions';
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
            return (
                <div style={{
                    padding: '24px',
                }}
                >
                    <Theme is_dark={boolean('Dark theme', false)}>
                        <Numpad
                            value={100}
                            onSubmit={(v) => action(`Value changed to ${v}`)}
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
            return (
                <div style={{
                    padding: '24px',
                }}
                >
                    <Theme is_dark={boolean('Dark theme', false)}>
                        <Numpad
                            value={100}
                            onSubmit={(v) => action(`Value changed to ${v}`)}
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
