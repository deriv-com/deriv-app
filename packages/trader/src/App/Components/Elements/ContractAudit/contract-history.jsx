import PropTypes         from 'prop-types';
import React             from 'react';
import {
    Money,
    ThemedScrollbars }   from 'deriv-components';
import { localize }      from 'deriv-translations';
import ContractAuditItem from './contract-audit-item.jsx';

const ContractHistory = ({
    currency,
    history = [],
}) => (
    <ThemedScrollbars
        style={{ width: '100%', height: '100%' }}
        autoHide
    >
        <div style={{ padding: '0.8rem 1.6rem' }}>
            {
                history.map((item, key) => (
                    <ContractAuditItem
                        key={key}
                        id={`dt_history_label_${key}`}
                        label={item.display_name}
                        timestamp={item.order_date}
                        value={Math.abs(+item.order_amount) !== 0 ?
                            <React.Fragment>
                                {+item.order_amount < 0 && <strong>-</strong>}
                                <Money
                                    amount={item.order_amount}
                                    currency={currency}
                                />
                            </React.Fragment>
                            :
                            localize('Cancelled')
                        }
                    />)
                )
            }
        </div>
    </ThemedScrollbars>
);

ContractHistory.propTypes = {
    currency: PropTypes.string,
    history : PropTypes.array,
};

export default ContractHistory;
