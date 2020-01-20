import PropTypes from 'prop-types';
import React     from 'react';

const ContractAuditItem = ({
    id,
    icon,
    label,
    value,
    value2,
}) => (
    <div id={id} className='contract-audit__grid'>
        {icon &&
            <div className='contract-audit__icon'>
                {icon}
            </div>
        }
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
    </div>
);

ContractAuditItem.propTypes = {
    icon  : PropTypes.node,
    id    : PropTypes.string,
    label : PropTypes.string,
    value : PropTypes.node,
    value2: PropTypes.node,
};

export default ContractAuditItem;
