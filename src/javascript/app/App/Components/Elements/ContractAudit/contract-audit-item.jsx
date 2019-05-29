import PropTypes from 'prop-types';
import React     from 'react';

const ContractAuditItem = ({
    label,
    value,
    value2,
}) => (
    <div className='contract-audit__item'>
        <span className='contract-audit__label'>
            {label}
        </span>
        <div className='contract-audit__value-wrapper'>
            <span className='contract-audit__value'>
                {value}
            </span>
            {value2 &&
            <span className='contract-audit__value2'>
                {value2}
            </span>
            }
        </div>
    </div>
);

ContractAuditItem.propTypes = {
    label: PropTypes.string,
    value: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    value2: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default ContractAuditItem;
