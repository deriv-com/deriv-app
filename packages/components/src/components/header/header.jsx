import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';

const Header = ({
    as: Tag,
    children,
    className,
    color,
    weight,
}) => {
    const classes = classNames('head', {
        'head__bold'          : ['bold', '700'].includes(weight),
        'head__semi-bold'     : weight === '500',
        'head__normal'        : ['normal', '400'].includes(weight),
        'head__thin'          : ['thin', '300'].includes(weight),
        'head__white'         : color === 'white',
        'head__prominent'     : color === 'prominent',
        'head__general'       : color === 'general',
        'head__less_prominent': color === 'less-prominent',
        'head__red'           : color === 'red',
        'head__green'         : color === 'green',
        'head__disabled'      : color === 'disabled',
    }, className);

    return (<Tag classNames={classes}>{children}</Tag>);
};

Header.propTypes = {
    as       : PropTypes.string,
    children : PropTypes.node,
    className: PropTypes.string,
    color    : PropTypes.string,
    weight   : PropTypes.string,
};

export default Header;
