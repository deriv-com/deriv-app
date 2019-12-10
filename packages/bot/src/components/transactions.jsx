import { ThemedScrollbars }     from 'deriv-components';
import { localize }             from 'deriv-translations';
import { PropTypes }            from 'prop-types';
import React                    from 'react';
import Transaction              from './transaction.jsx';
import { transaction_elements } from '../constants/transactions.js';
import { connect }              from '../stores/connect';
import                           '../assets/sass/transactions.scss';

const Transactions = ({ elements }) => {
    return (
        <div className='transactions'>
            <div className='transactions__header'>
                <span className='transactions__header-column transactions__header-spot'>
                    {localize('Entry/Exit spot')}
                </span>
                <span className='transactions__header-column transaction__header-profit'>
                    {localize('Buy price and P/L')}
                </span>
            </div>
            <div className='transactions__content'>
                <ThemedScrollbars
                    autoHide
                    style={{ height: 'calc(100vh - 365px)' }}
                >
                    { elements.map((element, index) => {
                        switch (element.type) {
                            case (transaction_elements.CONTRACT): {
                                const contract = element.data;
                                return (
                                    <Transaction
                                        key={`${contract.reference_id}${index}`}
                                        contract={contract}
                                    />
                                );
                            }
                            case (transaction_elements.DIVIDER): {
                                const run_id = element.data;
                                return (
                                    <div key={run_id} className='transactions__divider'>
                                        <div className='transactions__divider-line' />
                                    </div>
                                );
                            }
                            default: {
                                return null;
                            }
                        }
                    }) }
                </ThemedScrollbars>
            </div>
        </div>
    );
};

Transactions.propTypes = {
    contracts: PropTypes.array,
};

export default connect(({ transactions }) => ({
    elements: transactions.elements,
}))(Transactions);
