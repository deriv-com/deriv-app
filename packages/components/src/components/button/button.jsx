import classNames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import ButtonLoading from './buttonLoading.jsx';

// TODO: use Icons from components
const IconCheckmark = () => (
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
        <g fill='none' fillRule='evenodd'>
            <path d='M0 0h24v24H0z' />
            <path fill='#FFF' fillRule='nonzero' d='M9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0 .984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4.984.984 0 0 0-1.4 0L9 16.2z' />
        </g>
    </svg>
);

const Button = ({
    children,
    className = '',
    classNameSpan,
    has_effect,
    icon,
    id,
    is_disabled,
    is_loading,
    is_submit_success,
    onClick,
    tabIndex,
    text,
    wrapperClassName,
    type,
}) => {
    const classes = classNames('btn', { effect: has_effect }, className);
    const button = (
        <button
            id={id}
            className={classes}
            onClick={onClick || undefined}
            disabled={is_disabled}
            tabIndex={tabIndex || '0'}
            type={is_submit_success ? 'button' : (type || 'submit')}
        >
            {icon &&
                <div className='btn__icon'>
                    {icon}
                </div>
            }
            {text && !(is_loading || is_submit_success) &&
                <span className={classNames('btn__text', classNameSpan)}>
                    {text}
                </span>
            }
            {is_loading &&
                <ButtonLoading />
            }
            {is_submit_success &&
                <IconCheckmark />
            }
            {children}
        </button>
    );
    const wrapper = (<div className={wrapperClassName}>{button}</div>);

    return wrapperClassName ? wrapper : button;
};

Button.propTypes = {
    children          : PropTypes.node,
    className         : PropTypes.string,
    classNameSpa      : PropTypes.string,
    has_effect        : PropTypes.bool,
    Icon              : PropTypes.node,
    id                : PropTypes.string,
    is_disabled       : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    is_loading        : PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    is_submit_success : PropTypes.bool,
    onClick           : PropTypes.func,
    text              : PropTypes.string,
    wrapperClassName  : PropTypes.string,
};

export default Button;
