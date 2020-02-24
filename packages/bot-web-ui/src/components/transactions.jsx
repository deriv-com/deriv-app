import { ThemedScrollbars, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { PropTypes } from 'prop-types';
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Transaction from './transaction.jsx';
import { transaction_elements } from '../constants/transactions';
import { connect } from '../stores/connect';
import '../assets/sass/transactions.scss';
import { contract_stages } from '../constants/contract-stage';

class Transactions extends React.PureComponent {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const { contract_stage, elements } = this.props;
        return (
            <div className='transactions run-panel-tab__content'>
                <div className='transactions__header'>
                    <span className='transactions__header-column transactions__header-spot'>
                        {localize('Entry/Exit spot')}
                    </span>
                    <span className='transactions__header-column transaction__header-profit'>
                        {localize('Buy price and P/L')}
                    </span>
                </div>
                <div className='transactions__content'>
                    <ThemedScrollbars autoHide>
                        {elements.length ? (
                            <TransitionGroup>
                                {elements.map(element => {
                                    switch (element.type) {
                                        case transaction_elements.CONTRACT: {
                                            const { data: contract } = element;
                                            const { buy } = contract.transaction_ids;
                                            return (
                                                <CSSTransition key={buy} timeout={500} classNames='list__animation'>
                                                    <Transaction contract={contract} />
                                                </CSSTransition>
                                            );
                                        }
                                        case transaction_elements.DIVIDER: {
                                            const { data: run_id } = element;
                                            return (
                                                <CSSTransition key={run_id} timeout={500}>
                                                    <div key={run_id} className='transactions__divider'>
                                                        <div className='transactions__divider-line' />
                                                    </div>
                                                </CSSTransition>
                                            );
                                        }
                                        default: {
                                            return null;
                                        }
                                    }
                                })}
                            </TransitionGroup>
                        ) : (
                            <>
                                {contract_stage.index >= contract_stages.STARTING.index ? (
                                    <Transaction contract={null} />
                                ) : (
                                    <div className='transactions-empty__container'>
                                        <div className='transactions-empty'>
                                            <Icon
                                                icon='IcBox'
                                                className='transactions-empty__icon'
                                                size={64}
                                                color='secondary'
                                            />
                                            <h4 className='transactions-empty__header'>
                                                {localize('There are no transactions to display')}
                                            </h4>
                                            <div className='transactions-empty__message'>
                                                <span>{localize('Here are the possible reasons:')}</span>
                                                <ul className='transactions-empty__list'>
                                                    <li>{localize('The bot is not running')}</li>
                                                    <li>{localize('The stats are cleared')}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </ThemedScrollbars>
                </div>
            </div>
        );
    }
}

Transactions.propTypes = {
    contract_stage: PropTypes.object,
    elements: PropTypes.array,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
};

export default connect(({ transactions, run_panel }) => ({
    contract_stage: run_panel.contract_stage,
    elements: transactions.elements,
    onMount: transactions.onMount,
    onUnmount: transactions.onUnmount,
}))(Transactions);
