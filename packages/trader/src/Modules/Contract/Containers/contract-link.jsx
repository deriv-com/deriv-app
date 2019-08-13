import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';

const ContractLink = ({
    contract_id,
    children,
    className,
    openContract,
}) => (
    <a
        className={className}
        onClick={() => openContract(contract_id, true)}
    >
        {children}
    </a>
);

ContractLink.propTypes = {
    children   : PropTypes.node,
    className  : PropTypes.string,
    contract_id: PropTypes.number,
    onMount    : PropTypes.func,
};

export default connect(
    ({ modules }) => ({
        openContract: modules.contract_trade.onMount,
    }),
)(ContractLink);
