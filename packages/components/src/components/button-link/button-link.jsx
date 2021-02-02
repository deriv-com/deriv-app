import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { Link } from 'react-router-dom';

const ButtonLink = ({ children, className, to, onClick, size = 'medium' }) => {
    const { is_dashboard } = React.useContext(PlatformContext);

    return (
        <Link
            className={classNames(
                {
                    'dc-btn dc-btn--primary': !is_dashboard,
                    'dc-btn dc-btn--blue': is_dashboard,
                },
                className,
                'effect',
                `dc-btn__${size}`
            )}
            to={to}
            onClick={onClick}
        >
            {children}
        </Link>
    );
};
ButtonLink.propTypes = {
    children: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.string,
    to: PropTypes.string,
};

export default ButtonLink;
