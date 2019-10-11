import classNames from 'classnames';
import React      from 'react';
import PropTypes  from 'prop-types';
import Input      from '../input';

// TODO: use-from-shared - Use this icon from icons' shared package
const IconPasswordEye = ({ className, classNamePath, show_password, onClick }) => (
    <svg className={ classNames('inline-icon', className) } width='16' height='16' onClick={ onClick }>
        {
            show_password ?
                ( // This is a closed-eye icon to represent user ability to toggle to hide
                    <g id='outlined/action/hide' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                        <g id='ic-hide-password'>
                            <path id='Path' d='M0 0h16v16H0z' />
                            <path
                                className={ classNames('color1-fill', classNamePath) }
                                d='M14.177 2.118a.5.5 0 11.646.764l-2.048 1.732A7.925 7.925 0 0115.333 8c-1.153 2.927-4 5-7.333 5a7.83 7.83 0 01-3.908-1.038l-2.269 1.92a.5.5 0 11-.646-.764l2.047-1.733A7.925 7.925 0 01.667 8C1.82 5.073 4.667 3 8 3a7.83 7.83 0 013.909 1.038zm-2.265 3.226L10.58 6.472c.267.448.42.97.42 1.528 0 1.653-1.347 3-3 3-.736 0-1.41-.267-1.933-.708l-1.106.935C5.88 11.727 6.914 12 8 12c2.585 0 4.878-1.55 6-4a7.046 7.046 0 00-2.088-2.656zM8 4C5.422 4 3.122 5.55 2 8a7.05 7.05 0 002.086 2.656L5.42 9.528A2.98 2.98 0 015 8c0-1.653 1.347-3 3-3 .736 0 1.411.267 1.934.709l1.105-.935A6.336 6.336 0 008 4zm1.802 3.13L6.845 9.633A2 2 0 009.802 7.13zM8 6a2 2 0 00-1.802 2.87l2.957-2.503A1.99 1.99 0 008 6z'
                                id='Combined-Shape'
                                fill='#333'
                                fillRule='nonzero'
                            />
                        </g>
                    </g>
                )
                :
                ( // This is an open-eye icon to represent user ability to toggle to show
                    <g id='outlined/action/visible' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                        <g id='ic-show-password'>
                            <path id='Path' d='M0 0h16v16H0z' />
                            <path
                                className={ classNames('color1-fill', classNamePath) }
                                d='M8 4c2.578 0 4.878 1.55 6 4-1.122 2.45-3.415 4-6 4s-4.878-1.55-6-4c1.122-2.45 3.422-4 6-4m0-1C4.667 3 1.82 5.073.667 8c1.153 2.927 4 5 7.333 5s6.18-2.073 7.333-5c-1.153-2.927-4-5-7.333-5zm0 3a2 2 0 11-.001 4.001A2 2 0 018 6m0-1C6.347 5 5 6.347 5 8s1.347 3 3 3 3-1.347 3-3-1.347-3-3-3z'
                                id='Shape'
                                fill='#333'
                                fillRule='nonzero'
                            />
                        </g>
                    </g>
                )
        }
    </svg>
);

class PasswordInput extends React.Component {
    state = {
        show_password: false,
    };

    togglePasswordVisibility = () => {
        this.setState((prev_state) => ({ show_password: !prev_state.show_password }));
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
                    { ...otherProps }
                    type={ this.state.show_password ? 'text' : 'password' }
                    className={ classNames('dc-password-input__field', className) }
                    trailing_icon={
                        <IconPasswordEye
                            className='dc-password-input__visibility-icon'
                            show_password={ this.state.show_password }
                            onClick={ this.togglePasswordVisibility }
                        />
                    }
                />
            </div>
        );
    }
}

PasswordInput.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    has_error: PropTypes.bool,
    input    : PropTypes.oneOfType([
        PropTypes.string, PropTypes.number]),
};

export default PasswordInput;
