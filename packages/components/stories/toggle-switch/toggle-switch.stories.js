import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Switch from 'Components/toggle-switch';
import Wrapper from '../shared/wrapper';
import notes from './README.md';

const stories = storiesOf('Toggle switch', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'Basic usage',
    () => {
        const [is_enabled, setEnabled] = React.useState(false);
        return (
            <Wrapper is_dark={boolean('dark theme', false)}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        background: 'var(--general-section-1)',
                    }}
                >
                    <Switch
                        id='toggle-switch-story'
                        is_enabled={is_enabled}
                        handleToggle={() => setEnabled(!is_enabled)}
                    />
                    <h3
                        style={{
                            color: is_enabled ? 'var(--text-general)' : 'var(--text-disabled)',
                            marginLeft: '2rem',
                            fontSize: '1.6rem',
                        }}
                    >
                        E.g Text
                    </h3>
                </div>
            </Wrapper>
        );
    },
    {
        notes,
    }
);
