import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs, select, text } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import Button from 'Components/button';
import { FlexWrapper } from './shared-style';
import Theme from '../shared/theme';
import notes from './README.md';

const stories = storiesOf('Button', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories.add(
    'Basic usage',
    () => {
        const size = select('size', ['small', 'medium', 'large'], 'small');
        const type = select('type', ['primary', 'secondary', 'tertiary', 'primary_light', 'alternate'], 'primary');
        const color = select('color', ['blue', 'green', 'red'], 'red');
        return (
            <Theme is_dark={boolean('dark theme', false)}>
                <FlexWrapper>
                    <Button
                        onClick={action('clicked')}
                        text={text('text', 'Button')}
                        is_disabled={boolean('is_disabled', false)}
                        has_effect={boolean('has_effect', false)}
                        small={size === 'small'}
                        medium={size === 'medium'}
                        large={size === 'large'}
                        primary={type === 'primary'}
                        secondary={type === 'secondary'}
                        tertiary={type === 'tertiary'}
                        primary_light={type === 'primary_light'}
                        green={color === 'green'}
                        blue={color === 'blue'}
                        is_circle={boolean('is_circle', false)}
                        is_loading={boolean('is_loading', false)}
                        rounded={boolean('rounded', false)}
                    />
                </FlexWrapper>
            </Theme>
        );
    },
    {
        notes,
    }
);
