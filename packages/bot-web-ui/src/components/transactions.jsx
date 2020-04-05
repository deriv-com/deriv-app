import { localize } from '@deriv/translations';
import { ThemedScrollbars } from '@deriv/components';
import { PropTypes } from 'prop-types';
import React from 'react';
import { List, AutoSizer } from 'react-virtualized';
import Transaction from './transaction.jsx';
import { transaction_elements } from '../constants/transactions';
import { connect } from '../stores/connect';
import '../assets/sass/transactions.scss';

class Transactions extends React.PureComponent {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }
    renderRow = ({ index, style }) => {
        switch (this.props.elements[index].type) {
            case transaction_elements.CONTRACT: {
                const contract = this.props.elements[index].data;
                return (
                    <div style={style} key={`${contract.reference_id}${index}`}>
                        <Transaction contract={contract} style={style} />
                    </div>
                );
            }
            case transaction_elements.DIVIDER: {
                const run_id = this.props.elements[index].data;
                return (
                    <div key={run_id} className='transactions__divider' style={style}>
                        <div className='transactions__divider-line' />
                    </div>
                );
            }
            default: {
                return null;
            }
        }
    };

    handleScroll = ({ target }) => {
        const { scrollTop, scrollLeft } = target;
        this.list_ref.Grid.handleScrollEvent({ scrollTop, scrollLeft });
    };

    render() {
        const { elements } = this.props;

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
                <div className='' style={{ height: 'calc(var(--drawer-scroll-height) - 7px)' }}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <ThemedScrollbars
                                style={{
                                    height,
                                    width,
                                }}
                                onScroll={this.handleScroll}
                                autoHide
                            >
                                <List
                                    containerStyle={{ marginBottom: 117 }}
                                    style={{
                                        overflowX: false,
                                        overflowY: false,
                                    }}
                                    ref={ref => (this.list_ref = ref)}
                                    height={height}
                                    rowCount={elements.length}
                                    rowHeight={element =>
                                        this.props.elements[element.index].type === transaction_elements.DIVIDER
                                            ? 20
                                            : 50
                                    }
                                    rowRenderer={this.renderRow}
                                    width={width}
                                />
                            </ThemedScrollbars>
                        )}
                    </AutoSizer>
                </div>
            </div>
        );
    }
}

Transactions.propTypes = {
    elements: PropTypes.array,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
};

export default connect(({ transactions }) => ({
    elements: transactions.elements,
    onMount: transactions.onMount,
    onUnmount: transactions.onUnmount,
}))(Transactions);
