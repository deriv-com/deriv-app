import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';
import Input, { TInputProps } from '../input';

type TPasswordInput = Partial<TInputProps> & {
    autoComplete: string;
    className?: string;
    input_id?: string;
};

const PasswordInput = ({
    className, // Must not be passed to Input as the only trailing icon should be the visibility icon
    autoComplete, // Must be passed to Input, if not will get console warning
    input_id,
    ...otherProps
}: TPasswordInput) => {
    const [should_show_password, setShouldShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
        setShouldShowPassword(!should_show_password);
    };

    return (
        <div className='dc-password-input'>
            <Input
                {...otherProps}
                autoComplete={autoComplete}
                type={should_show_password ? 'text' : 'password'}
                input_id={input_id}
                className={classNames('dc-password-input__field', className)}
                trailing_icon={
                    <Icon
                        icon={should_show_password ? 'IcPasswordEyeVisible' : 'IcPasswordEyeHide'}
                        className='dc-password-input__visibility-icon'
                        onClick={togglePasswordVisibility}
                        color='secondary'
                        width={18}
                        data_testid='dt_password_input_visibility_icon'
                    />
                }
            />
        </div>
    );
};

export default PasswordInput;
