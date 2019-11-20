import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';

const Text = ({
    children,
    className,
    color,
    bold,
    size,
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
        'text__xs'            : size === 'xs',
        'text__s'             : size === 's',
        'text__m'             : size === 'm',
        'text__l'             : size === 'l',
    }, className);

    return (<p classNames={classes}>{children}</p>);
};

Text.propTypes = {
    as       : PropTypes.string,
    children : PropTypes.node,
    className: PropTypes.string,
    color    : PropTypes.string,
    weight   : PropTypes.string,
};

export default Header;
