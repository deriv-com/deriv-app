import className from 'classnames';
import { PropTypes } from 'prop-types';
import React from 'react';
import { connect } from '../stores/connect'
import { Translate } from '../utils/tools';
import { RiseFallIcon, IdIcon, ExitSpotIcon, EntrySpotIcon } from './Icons.jsx';

const Transaction = ({
    is_rise,
    refrence_id,
    buy_price,
    entry_spot,
    exit_spot,
    profit_loss,
    isSettled }) => {
    return (
        <div className='transactions__item'>
            <div className='transactions__trade-info'>
                <div className={className(
                    'transtactions__',
                    [is_rise ? 'rise' : 'fall']
                )}
                >
                    <RiseFallIcon />
                </div>
                <div className='transaction__col'>
                    <div>
                        <IdIcon />
                        <div className='transactions__id'>{refrence_id}</div>
                    </div>
                    <div>
                        <IdIcon />
                        <div className='transactions__buy-price'>{buy_price}</div>
                    </div>
                </div>
            </div>
            <div className='transactions__entry-exit-spot'>
                <div className='transaction__col'>
                    <div>
                        <EntrySpotIcon />
                        <div className='transactions__entry-spot'>{entry_spot}</div>
                    </div>
                    <div>
                        <ExitSpotIcon />
                        <div className='transactions__exit-spot'>{exit_spot}</div>
                    </div>
                </div>
            </div>
            <div className='transactions__profit-loss'>
                <span className={className(
                    'transtactions__',
                    [is_rise ? 'profit' : 'loss']
                )}>{is_rise ? '+' : '-'}</span>
                <div className='transactions__exit-spot'>{profit_loss}</div>
            </div>
            <div className='transactions__settled'>
                {isSettled ? <EntrySpotIcon/> : <ExitSpotIcon/>}
            </div>
        </div>
    )
}

class Transactions extends React.PureComponent {
    componentWillUnmount() {
        this.props.onUnmount();
    }
    
    render() {
        const { items } = this.props;

        return (
            <div className='transactions'>
                <div className='transactions__header'>
                    <span className='transactions__header-col'>{Translate('Trade information')}</span>
                    <span className='transactions__header-col'>{Translate('Entry/Exit spot')}</span>
                    <span className='transactions__header-col'>{Translate('Profit/Loss')}</span>
                </div>
                <div className='transactions_content'>
                    {
                        items.map((item) => {
                            <Transaction item={item} />
                        })
                    }
                </div>
            </div>
        )
    }
}

Transactions.protoTypes = {
    items     : PropTypes.array,
    onUnmount : PropTypes.func, 
}

export default connect(({ transactions }) => ({
    items     : transactions.items,
    onUnmount : transactions.onUnmount,
}))(Transactions);
