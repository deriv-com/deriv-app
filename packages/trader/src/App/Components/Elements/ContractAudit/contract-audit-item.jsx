import PropTypes from 'prop-types';
import React from 'react';
import { formatDate, formatTime } from '@deriv/shared';

const ContractAuditItem = ({ icon, id, label, timestamp, value, value2 }) => (
    <div id={id} className='contract-audit__grid'>
        {icon && <div className='contract-audit__icon'>{icon}</div>}
        <div className='contract-audit__item'>
            <span className='contract-audit__label'>{label}</span>
            <div className='contract-audit__value-wrapper'>
                <span className='contract-audit__value'>{value}</span>
                {value2 && <span className='contract-audit__value2'>{value2}</span>}
            </div>
        </div>
        {timestamp && (
            <div className='contract-audit__timestamp'>
                <span className='contract-audit__timestamp-value'>{formatDate(timestamp)}</span>
                <span className='contract-audit__timestamp-value'>{formatTime(timestamp)}</span>
            </div>
        )}
    </div>
);

ContractAuditItem.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string,
    value: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.node]),
    value2: PropTypes.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default ContractAuditItem;
