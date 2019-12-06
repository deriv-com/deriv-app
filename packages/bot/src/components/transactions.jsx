import { ThemedScrollbars } from 'deriv-components';
import { PropTypes }        from 'prop-types';
import React                from 'react';
import { localize }         from 'deriv-translations';
import Transaction          from './transaction.jsx';
import { connect }          from '../stores/connect';
import                           '../assets/sass/transactions.scss';

const Transactions = ({ contracts }) => {
    return (
        <div className='transactions'>
            <div className='transactions__header'>
                <span className='transactions__header-column'>{localize('Trade information')}</span>
                <span className='transactions__header-column'>{localize('Entry/Exit spot')}</span>
                <span className='transactions__header-column'>{localize('Profit/Loss')}</span>
            </div>
            <div className='transactions__content'>
                <ThemedScrollbars
                    autoHide
                    style={{ height: 'calc(100vh - 365px)' }}
                >
                    {
                        contracts.map((contract, index) => {
                            return <Transaction
                                key={`${contract.reference_id}${index}`}
                                contract={contract}
                            />;
                        })
                    }
                </ThemedScrollbars>
            </div>
        </div>
    );
};

Transactions.propTypes = {
    contracts: PropTypes.array,
};

export default connect(({ transactions }) => ({
    contracts: transactions.contracts,
}))(Transactions);
