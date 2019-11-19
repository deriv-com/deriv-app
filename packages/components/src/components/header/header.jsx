import React from 'react';
import PropTypes from 'prop-types';
import classNames        from 'classnames';

const Header = ({
    children,
    className,
    as: Tag,
    wh,
    color,
}) => {
    const classes = classNames('head', {
        'head__bold'          : ['bold', '700'].includes(wh),
        'head__semi-bold'     : wh === '500',
        'head__normal'        : ['normal', '400'].includes(wh),
        'head__thin'          : ['thin', '300'].includes(wh),
        'head__white'         : color === 'white',
        'head__prominent'     : color === 'prominent',
        'head__general'       : color === 'general',
        'head__less_prominent': color === 'less-prominent',
        'head__red'           : color === 'red',
        'head__green'         : color === 'green',
    }, className);
    return (<Tag classNames={classes}>{children}</Tag>);
};

export default Header;
