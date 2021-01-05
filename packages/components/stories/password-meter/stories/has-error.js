import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import PasswordMeter from 'Components/password-meter';
import PasswordInput from 'Components/password-input';
import Wrapper from '../../shared/wrapper';

const HasError = () => {
    const [new_password, updateNewPassword] = React.useState('');
    const has_error = 'Input has an error';

    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <PasswordMeter has_error={has_error} input={new_password}>
                <PasswordInput
                    autoComplete='new-password'
                    className='password-meter-storybook'
                    label='New password'
                    error={has_error}
                    onChange={e => updateNewPassword(e.target.value)}
                />
            </PasswordMeter>
        </Wrapper>
    );
};

export default HasError;
