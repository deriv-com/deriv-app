import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Input from '../input';

class PasswordInput extends React.Component {
    state = {
        show_password: false,
    };

    togglePasswordVisibility = () => {
        this.setState(prev_state => ({ show_password: !prev_state.show_password }));
    };

    render() {
        const {
            className,
            trailing_icon, // Must not be passed to Input as the only trailing icon should be the visibility icon
            ...otherProps
        } = this.props;

        return (
            <div className='dc-password-input'>
                <Input
                    {...otherProps}
                    type={this.state.show_password ? 'text' : 'password'}
                    className={classNames('dc-password-input__field', className)}
                    trailing_icon={
                        <Icon
                            icon={this.state.show_password ? 'IcPasswordEyeHide' : 'IcPasswordEyeVisible'}
                            className='dc-password-input__visibility-icon'
                            onClick={this.togglePasswordVisibility}
                            color='secondary'
                            width={18}
                        />
                    }
                />
            </div>
        );
    }
}

PasswordInput.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    has_error: PropTypes.bool,
    input: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PasswordInput;
