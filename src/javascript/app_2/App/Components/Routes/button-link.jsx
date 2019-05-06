import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import { Link }   from 'react-router-dom';

const ButtonLink = ({ children, className, to, onClick }) => (
    <Link
        className={classNames('btn btn--link', className, 'effect')}
        to={to}
        onClick={onClick}
    >
        {children}
    </Link>
);

ButtonLink.propTypes = {
    children : PropTypes.object,
    className: PropTypes.string,
    onClick  : PropTypes.func,
    to       : PropTypes.string,
};

export default ButtonLink;
