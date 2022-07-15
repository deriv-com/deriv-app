import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import FormSubmitButton from 'Components/form-submit-button';

storiesOf('FormSubmitButton', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <FormSubmitButton
                        is_disabled={false}
                        label={'Submit'}
                        is_center
                        has_cancel
                        cancel_label={'Back'}
                        onCancel={() => {}}
                        onClick={() => {}}
                    />
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
