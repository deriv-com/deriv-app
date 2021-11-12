import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Input from '../input';

const PasswordInput = ({
    className, // Must not be passed to Input as the only trailing icon should be the visibility icon
    autoComplete, // Must be passed to Input, if not will get console warning
    input_id,
    ...otherProps
}) => {
    const [should_show_password, setShouldShowPassword] = React.useState(false);

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
    autoComplete: PropTypes.string.isRequired,
    input_id: PropTypes.string,
};

export default PasswordInput;
