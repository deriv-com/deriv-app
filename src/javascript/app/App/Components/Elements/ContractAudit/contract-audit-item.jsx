import PropTypes from 'prop-types';
import React     from 'react';

const ContractAuditItem = ({
    label,
    value,
}) => (
    <div className='contract-audit__item'>
        <span className='contract-audit__label'>
            {label}
        </span>
        <span className='contract-audit__value'>
            {value}
        </span>
    </div>
);

ContractAuditItem.propTypes = {
    label: PropTypes.string,
    value: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default ContractAuditItem;
