import PropTypes from 'prop-types';
import React     from 'react';

const ContractAuditItem = ({
    icon,
    label,
    value,
    value2,
}) => (
    <React.Fragment>
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
    </React.Fragment>
);

ContractAuditItem.propTypes = {
    icon : PropTypes.node,
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
