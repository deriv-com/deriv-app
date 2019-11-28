import className       from 'classnames';
import {
    Money,
    Popover,
    ThemedScrollbars } from 'deriv-components';
import { PropTypes }   from 'prop-types';
import React           from 'react';
import { localize }    from 'deriv-translations';
import {
    BuyPriceIcon,
    ExitSpotIcon,
    EntrySpotIcon,
    PendingIcon,
    RefrenceIdIcon,
    CompletedIcon }    from './Icons.jsx';
import IconTradeType   from './icon-trade-types.jsx';
import { connect }     from '../stores/connect';
import                      '../assets/sass/transactions.scss';

const Transaction = ({ contract }) => {
    return (
        <table className='transactions__item'>
            <tbody>
                <tr className='transactions__row'>
                    <td className='transactions__middle transactions__col'>
                        <Popover
                            className='transactions__inline transactions__top'
                            alignment='left'
                            message={contract.contract_type}
                        >
                            <IconTradeType
                                trade_type={contract.contract_type}
                            />
                        </Popover>
                        <div className='transactions__inline transactions__middle'>
                            <div className='transactions__margin-bottom'>
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={localize('Reference ID')}
                                >
                                    <RefrenceIdIcon className='transactions__middle' />
                                </Popover>
                                <div className='transactions__inline transactions__middle'>
                                    {contract.refrence_id}
                                </div>
                            </div>
                            <div>
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={localize('Buy price')}
                                >
                                    <BuyPriceIcon className='transactions__middle' />
                                </Popover>

                                <Money
                                    amount={contract.buy_price}
                                    currency={contract.currency}
                                />
                            </div>
                        </div>
                    </td>
                    <td className='transactions__middle transactions__col'>
                        <div className='transactions__margin-bottom'>
                            <Popover
                                className='transactions__inline transactions__middle'
                                alignment='left'
                                message={localize('Entry spot')}
                            >
                                <EntrySpotIcon className='transactions__middle' />
                            </Popover>
                            <div className='transactions__inline transactions__middle'>
                                {contract.entry_spot}
                            </div>
                        </div>
                        <div>
                            <Popover
                                className='transactions__inline transactions__middle'
                                alignment='left'
                                message={localize('Exit spot')}
                            >
                                <ExitSpotIcon className='transactions__middle' />
                            </Popover>
                            <div className='transactions__inline transactions__middle'>
                                {contract.exit_spot}
                            </div>
                        </div>
                    </td>
                    <td className='transactions__col'>
                        {contract.profit ?
                            <div
                                className={className(
                                    'transactions__inline',
                                    'transactions__middle',
                                    {
                                        'transactions__green': contract.profit > 0,
                                        'transactions__red'  : contract.profit < 0,
                                    })}
                            >
                                <Money
                                    amount={Math.abs(contract.profit)}
                                    currency={contract.currency}
                                />
                            </div>
                            :
                            null
                        }
                    </td>
                    <td className='transactions__col'>
                        {
                            contract.is_completed ?
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={localize('Completed')}
                                >
                                    <CompletedIcon className='transactions__middle' />
                                </Popover> :
                                <Popover
                                    className='transactions__inline transactions__middle'
                                    alignment='left'
                                    message={localize('Pending')}
                                >
                                    <PendingIcon className='transactions__middle' />
                                </Popover>}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

const Transactions = ({
    contracts }) => {

    return (
        <div className='transactions'>
            <div className='transactions__header'>
                <span className='transactions__header--col'>{localize('Trade information')}</span>
                <span className='transactions__header--col'>{localize('Entry/Exit spot')}</span>
                <span className='transactions__header--col'>{localize('Profit/Loss')}</span>
            </div>
            <div className='transactions__content'>
                <ThemedScrollbars
                    autoHide
                    style={{ height: 'calc(100vh - 365px)' }}
                >
                    {
                        contracts.map((contract, index) => {
                            return <Transaction
                                key={`${contract.refrence_id}${index}`}
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
