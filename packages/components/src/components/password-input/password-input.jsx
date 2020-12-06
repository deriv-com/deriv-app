import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Input from '../input';

const PasswordInput = ({
    className, // Must not be passed to Input as the only trailing icon should be the visibility icon
    ...otherProps
}) => {
    const [should_show_password, setShouldShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
        setShouldShowPassword(!should_show_password);
    };

    return (
        <div className='dc-password-input'>
            <Input
                {...otherProps}
                type={should_show_password ? 'text' : 'password'}
                className={classNames('dc-password-input__field', className)}
                trailing_icon={
                    <Icon
                        icon={should_show_password ? 'IcPasswordEyeHide' : 'IcPasswordEyeVisible'}
                        className='dc-password-input__visibility-icon'
                        onClick={togglePasswordVisibility}
                        color='secondary'
                        width={18}
                    />
                }
            />
        </div>
    );
};

PasswordInput.propTypes = {
    className: PropTypes.string,
};

export default PasswordInput;
