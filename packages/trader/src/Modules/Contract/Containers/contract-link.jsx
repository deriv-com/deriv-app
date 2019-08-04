import PropTypes   from 'prop-types';
import React       from 'react';

const ContractLink = ({
    children,
    className,
    onClick,
}) => (
    <a
        className={className}
        href='javascript:;'
        onClick={onClick}
    >
        {children}
    </a>
);

ContractLink.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string,
    onClick  : PropTypes.func,
    onMount  : PropTypes.func,
};

export default ContractLink;
