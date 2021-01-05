import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import PasswordInput from 'Components/password-input';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <PasswordInput
            autoComplete='new-password'
            label='New password'
            name='new_password'
            onChange={action('onChange')}
        />
    </Wrapper>
);

export default Basic;
