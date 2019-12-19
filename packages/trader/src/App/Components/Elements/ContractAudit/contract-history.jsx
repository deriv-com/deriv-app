import PropTypes         from 'prop-types';
import React             from 'react';
import {
    Money,
    ThemedScrollbars }   from 'deriv-components';
import ContractAuditItem from './contract-audit-item.jsx';

const ContractHistory = ({
    audit = [],
    currency,
}) => (
    <ThemedScrollbars
        style={{ width: '100%', height: 'calc(100vh - 404px)' }}
        autoHide
    >
        <div style={{ padding: '0.8rem' }}>
            {
                audit.map((item, key) => (
                    <ContractAuditItem
                        key={key}
                        id={`dt_history_label_${key}`}
                        label={item.display_name}
                        timestamp={item.order_date}
                        value={<Money
                            amount={item.order_amount}
                            currency={currency}
                        />
                        }
                    />)
                )
            }
        </div>
    </ThemedScrollbars>
);

ContractHistory.propTypes = {
    audit   : PropTypes.array,
    currency: PropTypes.string,
};

export default ContractHistory;
