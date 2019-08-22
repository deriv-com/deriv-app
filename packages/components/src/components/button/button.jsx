import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import                 './button.scss';

const Button = ({
    children,
    className = '',
    classNameSpan,
    has_effect,
    id,
    is_disabled,
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
            type={type || 'submit'}
        >
            { text &&
                <span className={classNames('btn__text', classNameSpan)}>
                    {text}
                </span>
            }
            {children}
        </button>
    );
    const wrapper = (<div className={wrapperClassName}>{button}</div>);

    return wrapperClassName ? wrapper : button;
};

Button.propTypes = {
    children        : PropTypes.node,
    className       : PropTypes.string,
    classNameSpan   : PropTypes.string,
    has_effect      : PropTypes.bool,
    id              : PropTypes.string,
    is_disabled     : PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick         : PropTypes.func,
    text            : PropTypes.string,
    wrapperClassName: PropTypes.string,
};

export default Button;
