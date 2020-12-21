import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import PasswordMeter from 'Components/password-meter';
import PasswordInput from 'Components/password-input';
import Wrapper from '../../shared/wrapper';

const Basic = () => {
    const [new_password, updateNewPassword] = React.useState('');

    return (
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <PasswordMeter input={new_password}>
                <PasswordInput
                    autoComplete='new-password'
                    className='password-meter-storybook'
                    label='New password'
                    onChange={e => updateNewPassword(e.target.value)}
                />
            </PasswordMeter>
        </Wrapper>
    );
};

export default Basic;
