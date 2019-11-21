import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import                  './text.scss';

const Text = ({
    as: Tag,
    bold,
    children,
    className,
    color,
    large,
    medium,
    small,
    xsmall,
    align,
}) => {
    const classes = classNames('text', {
        'text__bold'          : bold,
        'text__primary'       : color === 'primary',
        'text__accent'        : color === 'accent',
        'text__prominent'     : color === 'prominent',
        'text__general'       : color === 'general',
        'text__less_prominent': color === 'less-prominent',
        'text__disabled'      : color === 'disabled',
        'text__white'         : color === 'white',
        'text__green'         : color === 'green',
        'text__red'           : color === 'red',
        'text_left'           : align === 'left',
        'text_center'         : align === 'center',
        'text_right'          : align === 'right',
        'text__m'             : !large && !medium && !small && !xsmall ? true : medium,
        'text__xs'            : xsmall,
        'text__s'             : small,
        'text__l'             : large,
    }, className);

    return (<Tag className={classes}>{children}</Tag>);
};

Text.propTypes = {
    align    : PropTypes.string,
    as       : PropTypes.string,
    bold     : PropTypes.bool,
    children : PropTypes.node,
    className: PropTypes.string,
    color    : PropTypes.string,
    large    : PropTypes.bool,
    medium   : PropTypes.bool,
    small    : PropTypes.bool,
    xsmall   : PropTypes.bool,
};

Text.defaultProps = {
    as   : 'p',
    color: 'general',
};

export default Text;
