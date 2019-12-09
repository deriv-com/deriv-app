import classNames               from 'classnames';
import {
    Money,
    Popover,
    UnderlyingIcon }           from 'deriv-components';
import React                   from 'react';
import { localize }            from 'deriv-translations';
import {
    BuyPriceIcon,
    ExitSpotIcon,
    EntrySpotIcon,
    InfoOutlineIcon }          from './Icons.jsx';
import IconTradeType           from './icon-trade-types.jsx';
import { getContractTypeName } from '../utils/contract';

const TransactionIconWithText = ({ icon, title, message, className }) => {
    return (
        <React.Fragment>
            <Popover
                className={classNames(className, 'transactions__icon')}
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
            <div className='transactions__cell transactions__symbol'>
                <TransactionIconWithText
                    icon={<UnderlyingIcon market={contract.underlying} />}
                    title={contract.display_name}
                />
            </div>
            <div className='transactions__cell transactions__trade-type'>
                <TransactionIconWithText
                    icon={<IconTradeType trade_type={contract.contract_type} />}
                    title={getContractTypeName(contract)}
                />
            </div>

            <div className='transactions__cell transactions__entry-spot'>
                <TransactionIconWithText
                    icon={<EntrySpotIcon />}
                    title={localize('Entry spot')}
                    message={contract.entry_spot}
                />
            </div>
            <div className='transactions__cell transactions__exit-spot'>
                <TransactionIconWithText
                    icon={<ExitSpotIcon />}
                    title={localize('Exit spot')}
                    message={contract.exit_spot}
                />
            </div>

            <div className='transactions__cell transactions__stake'>
                <TransactionIconWithText
                    icon={<BuyPriceIcon />}
                    title={localize('Buy price')}
                    message={
                        <Money
                            amount={contract.buy_price}
                            currency={contract.currency}
                        />
                    }
                />
            </div>
            <div className='transactions__cell transactions__profit'>
                {contract.profit &&
                    <div className={classNames({
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
            
            <div className='transactions__cell transactions__info'>
                <TransactionIconWithText
                    icon={<InfoOutlineIcon />}
                    title={
                        <div className='transactions__info-content'>
                            <div className='transactions__info-header'>
                                { localize('Start time:') }
                            </div>
                            <div className='transactions__info-value'>
                                { contract.date_start }
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default Transaction;
