import className               from 'classnames';
import {
    Money,
    Popover }                  from 'deriv-components';
import React                   from 'react';
import { localize }            from 'deriv-translations';
import {
    BuyPriceIcon,
    CompletedIcon,
    ExitSpotIcon,
    EntrySpotIcon,
    ReferenceIdIcon,
    StartTimeIcon,
    PendingIcon }              from './Icons.jsx';
import IconTradeType           from './icon-trade-types.jsx';
import { getContractTypeName } from '../utils/contract';

const TransactionIcon = ({ icon, title, message }) => {
    return (
        <React.Fragment>
            <Popover
                className='transactions__icon'
                alignment='left'
                message={title}
            >
                { icon }
            </Popover>
            { message }
        </React.Fragment>
    );
};

const Transaction = ({ contract }) => {
    return (
        <div className='transactions__item'>
            <div className='transactions__cell transactions__trade-type'>
                <TransactionIcon
                    icon={<IconTradeType trade_type={contract.contract_type} />}
                    title={getContractTypeName(contract)}
                />
            </div>
            <div className='transactions__cell transactions__reference'>
                <TransactionIcon
                    icon={<ReferenceIdIcon />}
                    title={localize('Reference ID')}
                    message={contract.reference_id}
                />
            </div>
            <div className='transactions__cell transactions__buy-price'>
                <TransactionIcon
                    icon={<BuyPriceIcon className='transactions__middle' />}
                    title={localize('Buy price')}
                    message={
                        <Money
                            amount={contract.buy_price}
                            currency={contract.currency}
                        />
                    }
                />
            </div>
            <div className='transactions__cell transactions__start-time'>
                <TransactionIcon
                    icon={<StartTimeIcon />}
                    title={localize('Start time')}
                    message={contract.date_start}
                />
            </div>
            <div className='transactions__cell transactions__entry-spot'>
                <TransactionIcon
                    icon={<EntrySpotIcon />}
                    title={localize('Entry spot')}
                    message={contract.entry_spot}
                />
            </div>
            <div className='transactions__cell transactions__exit-spot'>
                <TransactionIcon
                    icon={<ExitSpotIcon />}
                    title={localize('Exit spot')}
                    message={contract.exit_spot}
                />
            </div>
            <div className='transactions__cell transactions__profit'>
                {contract.profit &&
                    <div className={className({
                        'transactions__profit--win' : contract.profit > 0,
                        'transactions__profit--loss': contract.profit < 0,
                    })}
                    >
                        <Money
                            amount={Math.abs(contract.profit)}
                            currency={contract.currency}
                        />
                    </div>
                }
            </div>
            <div className='transactions__cell transactions__settlement'>
                { contract.is_completed ?
                    <TransactionIcon
                        icon={<CompletedIcon />}
                        title={localize('Completed')}
                    />
                    :
                    <TransactionIcon
                        icon={<PendingIcon />}
                        title={localize('Pending')}
                    />
                }
            </div>
        </div>
    );
};

export default Transaction;
